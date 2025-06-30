import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDB() {
  return open({
    filename: './db.sqlite3',
    driver: sqlite3.Database
  });
}
