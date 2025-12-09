import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { userId, mood, moodText, note } = body;

        if (!userId || !mood || !note) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'UserId, mood, and note are required' })
            };
        }

        const now = new Date();
        const adjustedTime = new Date(now.getTime() - (5 * 60 * 60 * 1000));
        const timestamp = adjustedTime.getTime();
        
        const month = adjustedTime.getMonth() + 1;
        const day = adjustedTime.getDate();
        const year = adjustedTime.getFullYear();
        let hours = adjustedTime.getHours();
        const minutes = adjustedTime.getMinutes();
        const seconds = adjustedTime.getSeconds();
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        const dateStr = `${month}/${day}/${year}, ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

        const params = {
            TableName: 'mood-tracker-moods',
            Item: {
                UserID: userId,
                timestamp: timestamp,
                date: dateStr, 
                mood: mood,       
                moodText: moodText || '',  
                note: note
            }
        };

        await dynamoDB.send(new PutCommand(params));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Mood recorded successfully',
                data: params.Item
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
