use std::{fmt::Display, str::from_utf8};

use sqlx::{
    database::HasArguments,
    postgres::PgArgumentBuffer,
    query::{Query, QueryAs},
    query_builder::Separated,
    Database, Encode, Execute, FromRow, IntoArguments, QueryBuilder, Type,
};

pub struct FilterBuilder {
    builder: String,
    table: String,
    count: usize,
}

pub trait Encodable {
    fn encode_to_str(&self) -> String;
}

impl FilterBuilder {
    pub fn new<S: ToString, R: ToString>(table: R, query: S) -> Self {
        Self {
            builder: query.to_string(),
            table: table.to_string(),
            count: 0,
        }
    }

    pub fn add<S, T>(&mut self, column: S, vs: Option<Vec<T>>) -> &mut Self
    where
        S: ToString,
        T: Encodable,
    {
        if self.count > 0 {
            self.builder.push_str(" and ");
        }
        self.count += 1;

        match vs {
            Some(vs) => {
                self.builder
                    .push_str(format!("{}_{} in ", self.table, column.to_string()).as_str());
                let mut list = "(".to_string();

                let mut count = 0;

                for v in vs.iter() {
                    if count > 0 {
                        list.push_str(", ");
                    }
                    count += 1;
                    list.push_str(v.encode_to_str().as_str());
                }
                list.push_str(")");
                self.builder.push_str(list.as_str());
            }
            None => {
                self.builder.push_str("true");
            }
        }

        self
    }

    pub fn sql(&self) -> String {
        self.builder.clone()
    }

    pub fn build_query_as<'q, DB, T>(&'q self) -> QueryAs<'q, DB, T, <DB as HasArguments<'q>>::Arguments> 
    where
        DB: Database,
        for<'r> T: FromRow<'r, <DB as Database>::Row>
    {
        sqlx::query_as::<DB, T>(&self.builder)
    }
}

impl Encodable for i32 {
    fn encode_to_str(&self) -> String {
        format!("{}", self)
    }
}
impl Encodable for String {
    fn encode_to_str(&self) -> String {
        format!("'{}'", self)
    }
}

impl Encodable for &str {
    fn encode_to_str(&self) -> String {
        self.to_string().encode_to_str()
    }
}
