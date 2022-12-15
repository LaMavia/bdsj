#!/usr/bin/python3

import os
from typing import Any, Dict
from typing_extensions import Self
from urllib.parse import parse_qs
from pathlib import Path
import mimetypes


class Response:
    headers: Dict[str, Any]
    body: str

    def __init__(self) -> None:
        self.headers = {}
        self.body = ""

    def set_header(self, key: str, value: Any) -> Self:
        self.headers[key] = value

        return self

    def append_body(self, fragment: str, delimiter: str = '\n') -> Self:
        self.body += f'{delimiter}{fragment}'

        return self

    def set_body(self, body: str) -> Self:
        self.body = body

        return self

    def send(self):
        for k, v in self.headers.items():
            print(f'{k}: {v}')

        print(f'\n{self.body}\n')


ROOT_PATH = Path('./public')
res = Response()

query = parse_qs(os.environ.get("QUERY_STRING"), keep_blank_values=True)
path = ROOT_PATH / (query['path'][0] if 'path' in query else '')

if ROOT_PATH in path.parents or ROOT_PATH == path:
    mime_acceptable = (os.environ.get("HTTP_ACCEPT") or '').split(';')
    mime = mimetypes.guess_type(path)[0]

    if mime:  # file request
        res.set_header(
            'content-type', mime
        ).set_header(
            'Status', '200 Successful'
        )
        with open(path, 'r') as f:
            res.set_body(f.read())
            f.close()
    elif any(['text/html' in x.split(',') for x in mime_acceptable]):  # regular route, return index
        res.set_header(
            'content-type', 'text/html'
        ).set_header(
            'status', '200 Successful'
        )
        with open(ROOT_PATH / 'index.html', 'r') as f:
            res.set_body(f.read())
            f.close()
    else:  # idk
        res.set_header(
            'status', '501 Not Implemented'
        ).set_header(
            'content-type', 'text/html'
        ).set_body(f"""
            <!DOCTYPE html>
            <head>
                <title>501: Not Implemented</title>
            </head>
            <body>
                <h1>501: Not Implemented</h1>
                <p>
                    Could not fulfil the given request:
                    <pre style="word-wrap: break-word;">
                        path: {str(path)}
                        acceptable: {', '.join(mime_acceptable)}
                        guessed mime: {str(mime)}
                    </pre>
                </p>
            </body>
        """)
else:
    res.set_header(
        'status', '403 Forbidden'
    ).set_header(
        'content-type', 'text/html'
    ).set_body(f"""
            <!DOCTYPE html>
            <head>
                <title>403: Forbidden</title>
            </head>
            <body>
                <h1>403: Forbidden</h1>
                <p>
                    Could not follow the requested path: {str(path)}
                </p>
            </body>
        """)


# res.set_body("hello!")

res.send()
