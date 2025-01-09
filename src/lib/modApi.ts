import ModerationAPI from "@moderation-api/sdk";

const modApi = new ModerationAPI({
  key: process.env.MODERATION_API_KEY!,
});

export default modApi;
