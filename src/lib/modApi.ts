import ModerationAPI from "@moderation-api/sdk";

const modApi = new ModerationAPI({
  url: "https://staging.moderationapi.com/api/v1",
  key: process.env.MODERATION_API_KEY!,
});

export default modApi;
