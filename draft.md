# Entities

1. Kraj
2. Zawodnik
3. Konkurs
4. Seria
5. Skok
6. Kwota startowa (Kraj, Konkurs)

```sql
zawodnik {
  id,
  imie,
  nazwisko,
  kraj_id, # czy aby? co jeśli różne kraje?
}

konkurs {
  id primary key,
  organizator,
  year,
  location,
  seria_kwalifikacyjna_id | null,
  
}

zgłoszenie {
  id,
  zawodnik,
  konkurs
}

kwota_startowa {
  id,
  kraj_id,
  konkurs_id,
  ilosc : uint | 2
}

seria {
  id,
  data : date 
}

pozycja {
  id, ?
  poz_startowa uint | random unique[pozycja],
    poz_końcowauint | null,
  zawodnik_id,
  seria_id,
}

skok {
  id,
  zawodnik_id,
  seria_id, 
  ocena uint,
  dlugosc uint,
}

dyskwalifikacja {
  id,
  zawodnik_id,
  seria_id,
  powod,
}

```

```psql
  
```
