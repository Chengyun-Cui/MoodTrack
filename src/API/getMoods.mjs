import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Get parameters from query string
        const userId = event.queryStringParameters?.userId;
        const limit = parseInt(event.queryStringParameters?.limit) || 7;

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'UserId is required' })
            };
        }

        const params = {
            TableName: 'mood-tracker-moods',
            KeyConditionExpression: 'UserID = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false, // Sort in descending order (newest first)
            Limit: limit
        };

        const result = await dynamoDB.send(new QueryCommand(params));

        // Transform data for frontend
        const moods = result.Items.map(item => ({
            id: item.timestamp,
            date: item.date,
            mood: item.mood,
            moodText: item.moodText,
            note: item.note
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: moods
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
