const orderModel = async (db) => {
  try {
    const query = `create table if not exists orders (
            id SERIAL PRIMArY KEY,
            userId VARCHAR(255) NOT NULL,
            items JSONB[] NOT NULL,
            amount NUMERIC(10, 2) NOT NULL,
            address JSONB NOT NULL,
            status VARCHAR(50) DEFAULT 'Food Processing',
            date TIMESTAMP DEFAULT NOW(),
            payment BOOLEAN DEFAULT FALSE
            );`;
    await db.query(query);
  } catch (error) {
    console.error("Error Creating table:", error);
  }
};

export default orderModel;
