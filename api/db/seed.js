// const dynamoose = require('./');
// const Account = require('./Account');
// const File = require('./File');
// const Organization = require('./Organization');
// const Website = require('./Website');
//
// (async function() {
//   try {
//     console.log('Creating Account table...');
// 
//     const accountTable = await Account.table.create.request();
//     console.log(accountTable);
//
//     await dynamoose.aws.ddb().createTable(accountTable).promise();
//   } catch (error) {
//     console.error(error);
//   }
//
//   try {
//     console.log('Creating File table...');
//
//     const fileTable = await File.table.create.request();
//     console.log(fileTable);
//
//     await dynamoose.aws.ddb().createTable(fileTable).promise();
//   } catch (error) {
//     console.error(error);
//   }
//
//   try {
//     console.log('Creating Organization table...');
//
//     const organizationTable = await Organization.table.create.request();
//     console.log(organizationTable);
//
//     await dynamoose.aws.ddb().createTable(organizationTable).promise();
//   } catch (error) {
//     console.error(error);
//   }
//
//   try {
//     console.log('Creating Website table...');
//
//     const websiteTable = await Website.table.create.request();
//     console.log(websiteTable);
//
//     await dynamoose.aws.ddb().createTable(websiteTable).promise();
//   } catch (error) {
//     console.error(error);
//   }
//
//   console.log('Done!');
//   process.exit(0);
// })();
