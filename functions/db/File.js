const dynamoose = require('./');
const Organization = require('./Organization');

const FILE_IN_ORGANIZATION_SORTED_BY_UPDATED_AT = 'FileInOrganizationSortedByUpdatedAt';

const schema = new dynamoose.Schema({
  'id': {
    hashKey: true,
    type: String,
    index: [
      {
        global: true,
        name: 'fileTypeIndex',
        rangeKey: 'fileType',
        project: true,
      },
      {
        global: true,
        name: 'searchNameIndex',
        rangeKey: 'searchName',
        project: true,
      },
      {
        global: true,
        name: 'createdAtIndex',
        rangeKey: 'createdAt',
        project: true,
      },
      {
        global: true,
        name: 'updatedAtIndex',
        rangeKey: 'updatedAt',
        project: true,
      },
    ],
  },
  'organizationId': {
    type: String,
    rangeKey: true,
  },
  'name': {
    type: String,
  },
  'searchName': {
    type: String,
  },
  'uploadedBy': {
    type: String,
  },
  'lastUpdatedBy': {
    type: String,
  },
  'fileSize': {
    type: Number,
  },
  'fileType': {
    type: String,
  },
}, {
  'timestamps': true,
});

const options = {
  create: true,
  throughput: 'ON_DEMAND',
};

const File = dynamoose.model('Files', schema, options);

File.methods.set('findById', async function(id) {
  const fileQuery = await this.query('id').eq(id).exec();
  const [file] = fileQuery;

  return file;
});

File.methods.set('findAllForOrganization', async function(
  organizationId = null,
  fileTypes = null,
  name = null,
  startAt = null,
  sortOn = 'updatedAt',
  sortDirection = 1,
  limit = 25,
) {
  const fileQuery = this.query('organizationId').eq(organizationId);

  // if (name) {
  //   fileQuery.where('searchNameIndex').contains(name.toLowerCase());
  // }
  //
  // if (fileTypes) {
  //   fileQuery.where('fileTypeIndex').in(fileTypes);
  // }
  //
  // if (startAt) {
  //   fileQuery.startAt(startAt);
  // }

  // if (sortOn && typeof sortDirection === 'number') {
  //   const direction = sortDirection > 0 ? 'ascending' : 'descending';
  //
  //   if (sortOn === 'updatedAt') {
  //     fileQuery.where('updatedAtIndex').sort(direction);
  //   }
  //
  //   if (sortOn === 'createdAt') {
  //     fileQuery.where('createdAtIndex').sort(direction);
  //   }
  // }

  fileQuery.limit(limit);

  const [files] = await fileQuery.exec();

  return files;
});

module.exports = File;
