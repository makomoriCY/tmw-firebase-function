const msg = {
  messages: [
    {
      type: 'text',
      channelSegment: 1,
      tags: ['string'],
      childrenNumber: 0,
      isDeleted: false,
      editedAt: '2021-08-20T02:12:26.760Z',
      updatedAt: '2021-08-20T02:12:26.763Z',
      createdAt: '2021-08-20T02:12:26.763Z',
      messageId: '2',
      userId: '35',
      channelId: '6',
      flagCount: 0,
      hashFlag: null,
      reactions: {},
      reactionsCount: 0,
      myReactions: [],
      parentId: null,
      fileId: null,
      data: {
        text: 'test send'
      }
    }
  ],
  users: [
    {
      updatedAt: '2021-08-19T09:15:33.271Z',
      createdAt: '2021-08-19T09:15:33.271Z',
      displayName: 'displayName_test',
      userId: '35',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: []
}

//บล็อกลิสอยู่ใน metadata
const profile = {
  users: [
    {
      updatedAt: '2021-08-18T07:30:38.835Z',
      createdAt: '2021-08-13T08:03:15.353Z',
      displayName: 'ttt',
      userId: 'test id',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: []
}

const profile2 = {
  users: [
    {
      updatedAt: '2021-08-18T07:30:38.835Z',
      createdAt: '2021-08-13T08:03:15.353Z',
      displayName: 'ttt',
      userId: 'test id',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null,
      blockList: ['10', '16', '13']
    }
  ],
  files: []
}

const getUserFromchannesls = {
  channels: [
    {
      isDistinct: false,
      type: 'community',
      metadata: {},
      tags: ['string'],
      isMuted: false,
      lastActivity: '2021-08-20T01:59:03.811Z',
      updatedAt: '2021-08-20T01:59:03.810Z',
      createdAt: '2021-08-20T01:59:03.810Z',
      isRateLimited: false,
      rateLimitWindow: 1000,
      displayName: 'CH 6',
      messageAutoDeleteEnabled: false,
      autoDeleteMessageByFlagLimit: 0,
      isDeleted: false,
      channelId: '6',
      memberCount: 2,
      messageCount: 0,
      avatarFileId: null
    }
  ],
  channelUsers: [
    {
      membership: 'member',
      lastActivity: '2021-08-20T01:59:03.816Z',
      readToSegment: 0,
      isMuted: false,
      createdAt: '2021-08-20T01:59:03.816Z',
      updatedAt: '2021-08-20T01:59:03.816Z',
      isBanned: false,
      userId: '1',
      channelId: '6',
      roles: [],
      permissions: []
    },
    {
      membership: 'member',
      lastActivity: '2021-08-20T01:59:03.816Z',
      readToSegment: 0,
      isMuted: false,
      createdAt: '2021-08-20T01:59:03.816Z',
      updatedAt: '2021-08-20T01:59:03.816Z',
      isBanned: false,
      userId: '35',
      channelId: '6',
      roles: [],
      permissions: []
    }
  ],
  users: [
    {
      updatedAt: '2021-08-18T07:30:38.835Z',
      createdAt: '2021-08-13T08:03:15.353Z',
      displayName: 'ttt',
      userId: '1',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    },
    {
      updatedAt: '2021-08-19T09:15:33.271Z',
      createdAt: '2021-08-19T09:15:33.271Z',
      displayName: 'displayName_test',
      userId: '35',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: [],
  paging: {}
}

const getChannels = {
  channels: [
    {
      isDistinct: false,
      type: 'community',
      metadata: {},
      tags: ['string'],
      isMuted: false,
      lastActivity: '2021-08-19T09:18:05.420Z',
      updatedAt: '2021-08-19T09:18:05.419Z',
      createdAt: '2021-08-19T09:18:05.419Z',
      isRateLimited: false,
      rateLimitWindow: 1000,
      displayName: 'CH 4',
      messageAutoDeleteEnabled: false,
      autoDeleteMessageByFlagLimit: 0,
      isDeleted: false,
      channelId: '4',
      memberCount: 2,
      messageCount: 0,
      avatarFileId: null
    }
  ],
  channelUsers: [
    {
      membership: 'member',
      lastActivity: '2021-08-19T09:18:05.426Z',
      readToSegment: 0,
      isMuted: false,
      createdAt: '2021-08-19T09:18:05.426Z',
      updatedAt: '2021-08-19T09:18:05.426Z',
      isBanned: false,
      userId: '1',
      channelId: '4',
      roles: [],
      permissions: []
    },
    {
      membership: 'member',
      lastActivity: '2021-08-19T09:18:05.426Z',
      readToSegment: 0,
      isMuted: false,
      createdAt: '2021-08-19T09:18:05.426Z',
      updatedAt: '2021-08-19T09:18:05.426Z',
      isBanned: false,
      userId: '35',
      channelId: '4',
      roles: [],
      permissions: []
    }
  ],
  users: [
    {
      updatedAt: '2021-08-18T07:30:38.835Z',
      createdAt: '2021-08-13T08:03:15.353Z',
      displayName: 'ttt',
      userId: '1',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    },
    {
      updatedAt: '2021-08-19T09:15:33.271Z',
      createdAt: '2021-08-19T09:15:33.271Z',
      displayName: 'displayName_test',
      userId: '35',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: [],
  paging: {}
}

const createChannels = {
  channels: [
    {
      isDistinct: false,
      type: 'community',
      metadata: {},
      tags: ['string'],
      isMuted: false,
      lastActivity: '2021-08-20T01:59:03.811Z',
      updatedAt: '2021-08-20T01:59:03.810Z',
      createdAt: '2021-08-20T01:59:03.810Z',
      isRateLimited: false,
      rateLimitWindow: 1000,
      displayName: 'CH 6',
      messageAutoDeleteEnabled: false,
      autoDeleteMessageByFlagLimit: 0,
      isDeleted: false,
      channelId: '6',
      memberCount: 2,
      messageCount: 0,
      avatarFileId: null
    }
  ],
  channelUsers: [
    {
      membership: 'member',
      lastActivity: '2021-08-20T01:59:03.816Z',
      readToSegment: 0,
      isMuted: false,
      createdAt: '2021-08-20T01:59:03.816Z',
      updatedAt: '2021-08-20T01:59:03.816Z',
      isBanned: false,
      userId: '35',
      channelId: '6',
      roles: [],
      permissions: []
    }
  ],
  users: [
    {
      updatedAt: '2021-08-19T09:15:33.271Z',
      createdAt: '2021-08-19T09:15:33.271Z',
      displayName: 'displayName_test',
      userId: '35',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: []
}

const createMsg = {
  messages: [
    {
      type: 'text',
      channelSegment: 1,
      tags: ['string'],
      childrenNumber: 0,
      isDeleted: false,
      editedAt: '2021-08-19T08:31:13.363Z',
      updatedAt: '2021-08-19T08:31:13.367Z',
      createdAt: '2021-08-19T08:31:13.367Z',
      messageId: '1',
      userId: '_admin_thanatorn',
      channelId: '3',
      flagCount: 0,
      hashFlag: null,
      reactions: {},
      reactionsCount: 0,
      myReactions: [],
      parentId: null,
      fileId: null,
      data: {
        text: 'sdaasdsadas'
      }
    }
  ],
  users: [
    {
      updatedAt: '2021-08-13T08:06:09.969Z',
      createdAt: '2021-08-13T08:06:09.969Z',
      displayName: 'mkc',
      userId: '_admin_thanatorn',
      metadata: {},
      roles: ['global-admin'],
      permissions: [
        'CREATE_ROLE',
        'DELETE_ROLE',
        'EDIT_ROLE',
        'CREATE_COMMUNITY_CATEGORY',
        'EDIT_COMMUNITY_CATEGORY',
        'DELETE_COMMUNITY_CATEGORY',
        'DELETE_COMMUNITY',
        'EDIT_COMMUNITY',
        'EDIT_COMMUNITY_USER',
        'ADD_COMMUNITY_USER',
        'BAN_COMMUNITY_USER',
        'REMOVE_COMMUNITY_USER',
        'EDIT_COMMUNITY_POST',
        'DELETE_COMMUNITY_POST',
        'REVIEW_COMMUNITY_POST',
        'EDIT_COMMUNITY_COMMENT',
        'DELETE_COMMUNITY_COMMENT',
        'EDIT_USER_FEED_POST',
        'DELETE_USER_FEED_POST',
        'EDIT_USER_FEED_COMMENT',
        'DELETE_USER_FEED_COMMENT',
        'BAN_USER',
        'EDIT_USER',
        'EDIT_CHANNEL_USER',
        'BAN_USER_FROM_CHANNEL',
        'ADD_CHANNEL_USER',
        'REMOVE_CHANNEL_USER',
        'EDIT_CHANNEL',
        'MUTE_CHANNEL',
        'MUTE_USER_INSIDE_CHANNEL',
        'EDIT_CHANNEL_RATELIMIT',
        'DELETE_MESSAGE',
        'EDIT_MESSAGE',
        'Channel/BanUser',
        'Channel/MuteUser',
        'Channel/MuteChannel',
        'Channel/RateLimitUser',
        'Channel/RateLimitChannel',
        'Channel/ManageMessages',
        'Channel/ManageUsers',
        'Channel/GlobalAccess',
        'User/ExemptFromFilters',
        'User/ExemptFromRateLimits',
        'User/ExemptFromMute',
        'User/ExempFromBan',
        'User/ExempFromBlacklist',
        'User/ExempFromWhitelist',
        'User/ExempFromRepetitionCheck',
        'Post/ManagePosts',
        'Post/ManageComments',
        'Community/ManageCommunities',
        'MANAGE_NOTIFICATION_NETWORK_SETTING'
      ],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: []
}

//user 36
const register = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjViZDhlYWViMzIzZDdlY2VlYWNlNGYwMWVjNjM0MjIyYTUwNDA0NjY5ZmNmODUxNDA0MTMwZTE1YzZjYjkwNWU2NTI0ZTdmNDQ3MzMwYzcyMjQyYTkzNzQ4NmY1M2QzYTVhNzQ2MWE0MGM1ODBjYWM5MGMyYjg5NzU2ZjU0ZjZmOGM2MzM0ZWQ0ZDg3YzY1Nzg5NjliMzNhNGJhOTQ2NzhhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMDY0N2Q1NDkyYzRiMzBlZmY1Y2I2NWI3NGNjMzkwYWU1MmMyYzMzMzcxZTk1IiwiaWF0IjoxNjI5NDQ1MDQxLCJleHAiOjE2NjA5ODEwNDF9.0E7WE32_2GMIX5rI35BOywoIg7hORhAt7ZvcI2h6grc',
  refreshToken:
    'bd8a7bb5cb2ac4df1bfd423be4ce63f13b60f686217b8ff6f5d8fddee841a14ed30e1bb58a1fd736',
  users: [
    {
      updatedAt: '2021-08-20T07:37:21.706Z',
      createdAt: '2021-08-20T07:37:21.706Z',
      displayName: 'displayName_test',
      userId: '36',
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  ],
  files: []
}

const profileSender = {
  senderProfile: {
    displayName: 'I am 35',
    userId: '35',
    metadata: {
      blockList: ['291', '2931']
    },
    avatarFileId: null
  }
}

const profileReceiver = {
  receiverProfile: {
    displayName: 'I am 29',
    userId: '29',
    metadata: {
      blockList: ['3']
    },
    avatarFileId: null
  }
}

module.exports = {
  msg,
  profile,
  profile2,
  createChannels,
  createMsg,
  getChannels,
  getUserFromchannesls,
  register,
  profileReceiver,
  profileSender
}

//Request Body: createChatRoom
// {
//   "senderProfile" : {
//       "displayName": "I am 35",
//       "userId": "35",
//       "metadata": {
//           "blockList" : ["1", "23"]
//       },
//       "avatarFileId": null
//   },
//   "receiverProfile" : {
//       "displayName": "I am 29",
//       "userId": "29",
//       "metadata": {},
//       "avatarFileId": null
//   }
// }

//Response Body: createChatRoom
// {
//   "senderProfile" : {
//       "displayName": "I am 35",
//       "userId": "35",
//       "metadata": {
//           "blockList" : ["1", "23"]
//       },
//       "avatarFileId": null
//   },
//   "receiverProfile" : {
//       "displayName": "I am 29",
//       "userId": "29",
//       "metadata": {},
//       "avatarFileId": null
//   },
//   "friendStatus" : true,
//   "blockListStatus" : false,
// }

//================================================================

//Request Body: sendMessageNotification
// {
//   "message" : {
//       "id" : "322",
//       "text" : "Hello world to 29."
//   },
//   "senderProfile" : {
//       "displayName": "I am 35",
//       "userId": "35",
//       "metadata": {
//           "blockList" : ["1", "23"]
//       },
//       "avatarFileId": null
//   },
//   "receiverProfile" : {
//       "displayName": "I am 29",
//       "userId": "29",
//       "metadata": {},
//       "avatarFileId": null
//   }
// }

//Response Body: sendMessageNotification
// {
//   "status" : true
// }

//================================================================

//Request body: getBadWordList
// N/A

//Response body: getBadWordList
// {
//   "badWordList" : [
//       "pussy", "shit", "fuck", "ass"
//   ]
// }

//================================================================

//Request Body: updateMessageStatus
// {
//   "message" : {
//       "id" : "299",
//       "data" : "Give me 100 Baht.",
//       "metadata" : {
//           "type" : "transfer",
//           "status" : "request"
//       }
//   }
//   "updateToStatus" : "paid"
// }

//Response Body: updateMessageStatus
// {
//   "message" : {
//       "id" : "299",
//       "data" : "[Paid] Give me 100 Baht.",
//       "metadata" : {
//           "type" : "transfer",
//           "status" : "paid"
//       }
//   }
// }


//Request Body: transferMoneySuccess
// {
//   "transferId" : "t-122454566",
//   "messageId" : "3",
//   "amt" : "100",
//   "currency" : "baht",
//   "timestamp" : "timestamp",
//   "sender" : "29",
//   "receiver" : "35"
// }
