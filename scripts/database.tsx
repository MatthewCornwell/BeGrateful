import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("begrateful.db");

export interface Moment {
  id: number;
  image_uri: string;
  caption: string;
  location_label: string;
  weather_temp: string;
  date_created: string;
}

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS moments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_uri TEXT NOT NULL,
      caption TEXT,
      location_label TEXT,
      weather_temp TEXT,
      date_created TEXT
    );
  `);
};

export const addMoment = (
  image: string,
  caption: string,
  location: string,
  weather: string
) => {
  db.runSync(
    "INSERT INTO moments (image_uri, caption, location_label, weather_temp, date_created) VALUES (?, ?, ?, ?, ?)",
    image,
    caption,
    location,
    weather,
    new Date().toISOString()
  );
};

export const getMoments = (): any[] => {
  return db.getAllSync("SELECT * FROM moments ORDER BY date_created DESC");
};

export const deleteMoment = (id: number) => {
  db.runSync("DELETE FROM moments WHERE id = ?", id);
};

export const updateMoment = (id: number, newCaption: string) => {
  db.runSync("UPDATE moments SET caption = ? WHERE id = ?", newCaption, id);
};
