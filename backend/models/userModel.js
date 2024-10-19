const userModel = async (db) => {
  try {
    const query = `create table if not exists users (
            id serial primary key,
            name varchar(100) not null,
            email varchar(100) unique not null,
            password varchar(100) not null,
            cartdata jsonb default '{}'
            );`;
    await db.query(query);
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

export default userModel;
