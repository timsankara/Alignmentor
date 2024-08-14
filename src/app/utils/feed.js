const AWS = require('aws-sdk');

// Configure AWS SDK (make sure you have proper credentials set up)
AWS.config.update({
  accessKeyId: "AKIA55SBB5ENSF3SCWFI",
  secretAccessKey: "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",
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
let tableName = 'AISafetyContent';

async function getFeedItems() {
  console.log("getFeedItems");
  const params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES'
  };

  try {
    const data = await dynamodb.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error scanning DynamoDB:", error);
    throw error;
  }
}

async function createFeedItem(feedItem) {
  const params = {
    TableName: tableName,
    Item: feedItem,
  };

  try {
    await dynamodb.put(params).promise();
    console.log('Feed item created successfully');
    return feedItem;
  } catch (error) {
    console.error('Error creating feed item in DynamoDB:', error);
    throw error;
  }
}

async function getFeedItemById(_id){
  const params = {
    TableName: tableName,
    Key: {
      _id: _id
    }
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error("Error getting feed item by ID from DynamoDB:", error);
    throw error;
  }
}

// @ts-ignore
async function queryUserBySid(sid) {
  const params = {
    TableName: 'findependence_users',
    KeyConditionExpression: 'sid = :sid',
    ExpressionAttributeValues: {
      ':sid': sid
    }
  };

  try {
    const data = await dynamodb.query(params).promise();
    // @ts-ignore
    if (data.Items.length > 0) {
      // @ts-ignore
      return data.Items[0]; // Return the first (and should be only) matching user
    } else {
      return null; // No user found with the given sid
    }
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    throw error;
  }
}

async function createUser(userData) {
  // Ensure the userData has a sid
  if (!userData.sid) {
    throw new Error('User data must include a sid');
  }

  const params = {
    TableName: tableName,
    Item: userData,
    ConditionExpression: 'attribute_not_exists(sid)' // Ensure we don't overwrite an existing user
  };

  try {
    await dynamodb.put(params).promise();
    console.log('User created successfully');
    return userData;
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.error('A user with this sid already exists');
    } else {
      console.error('Error creating user in DynamoDB:', error);
    }
    throw error;
  }
}

module.exports = { queryUserBySid, createUser, getFeedItems, createFeedItem, getFeedItemById };
// Usage example
// queryUserBySid('user123')
//   .then(user => console.log(user))
//   .catch(error => console.error(error));