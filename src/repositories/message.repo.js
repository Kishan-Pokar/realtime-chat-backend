const pool = require('../config/db');

const saveMessage = async (message) => {
    const query = `
    INSERT INTO messages (id, sender_id, receiver_id, content, timestamp, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
        message.id,
        message.from,
        message.to,
        message.content,
        message.timestamp,
        message.status
    ];

    await pool.query(query, values);
};

const updateMessageStatus = async (id, status) => {
    await pool.query(
        `UPDATE messages SET status = $1 WHERE id = $2`,
        [status, id]
    );
};

const getUndeliveredMessages = async (userId) => {
    const { rows } = await pool.query(
        `SELECT 
            id,
            sender_id as "from",
            receiver_id as "to",
            content,
            timestamp,
            status
        FROM messages
        WHERE receiver_id = $1 AND status != 'DELIVERED'
        ORDER BY timestamp ASC`,
        [userId]
    );
    return rows;
}

module.exports = {
    saveMessage,
    updateMessageStatus,
    getUndeliveredMessages,
};
