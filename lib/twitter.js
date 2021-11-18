import Mongoose from "mongoose";
import axios from "axios";

const twitterSchema = new Mongoose.Schema({
  id: { type: String, required: true },
  created_at: { type: String, required: true },
  text: { type: String, required: true },
  author: {
    type: {
      id: String,
      profile_image_url: String,
      name: String,
      username: String,
    },
    required: true,
  },
  media: {
    type: [
      {
        media_key: { type: String, required: false },
        type: { type: String, required: false },
        url: { type: String, required: false },
      },
    ],
    required: true,
  },
  type: { type: String, required: true },
});

export const getArtistInfo = async (artistId) =>
  await axios
    .get(
      `https://api.twitter.com/2/users/${artistId}?user.fields=description,profile_image_url,public_metrics,created_at,entities`,
      {
        headers: {
          Authorization: process.env.TWITTER_AUTH,
          Cookie: process.env.TWITTER_COOKIE,
        },
        redirect: "follow",
      }
    )
    .then((response) => response.data);

export const getList = async (artistId, max) => {
  //sinceId is optional parameter

  let url = `https://api.twitter.com/2/users/${artistId}/tweets?max_results=${max}&expansions=attachments.media_keys,referenced_tweets.id&media.fields=preview_image_url,url`;

  const timeline = await axios(url, {
    headers: {
      Authorization: process.env.TWITTER_AUTH,
      Cookie: process.env.TWITTER_COOKIE,
    },
    redirect: "follow",
  })
    .then((response) => JSON.stringify(response?.data))
    .then((response) => JSON.parse(response))
    .then((response) => response.data);
  const tweetList = [];
  for (let i in timeline) {
    if (timeline[i].referenced_tweets === undefined) {
      tweetList.push(timeline[i].id);
    } else if (timeline[i].referenced_tweets[0].type === "retweeted") {
      tweetList.push(timeline[i].referenced_tweets[0].id);
    } else {
      tweetList.push(timeline[i].id);
    }
  }
  return tweetList;
};

export const update = async (artist, tweetList) => {
  const Post = Mongoose.model(artist, twitterSchema);

  const tweetData = await axios(
    `https://api.twitter.com/2/tweets?ids=${tweetList.join()}&tweet.fields=created_at&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url&user.fields=profile_image_url`,
    {
      headers: {
        Authorization: process.env.TWITTER_AUTH,
        Cookie: process.env.TWITTER_COOKIE,
      },
      redirect: "follow",
    }
  )
    .then((response) => JSON.stringify(response?.data))
    .then((response) => JSON.parse(response));
  for (let i of tweetData.data) {
    const tweetId = i.id;
    let text = i.text;
    if (typeof text === "string") {
      text = text.replace(/&lt;/g, "<");
      text = text.replace(/&gt;/g, ">");
      text = text.replace(/&amp;/g, "&");
      text = text.replace(/&quot;/g, '"');
      text = text.replace(/&num;/g, "#");
      text = text.replace(/&semi;/g, ";");
      text = text.replace(/&Hat;/g, "^");
      text = text.replace(/&apos;/g, "'");
      text = text.replace(/&nbsp;/g, " ");
    }
    const created_at = i.created_at;
    const mediaList = [];
    let author;

    for (let user of tweetData.includes.users) {
      if (user.id === i.author_id) {
        author = user;
      }
    }

    if (i.attachments != undefined) {
      for (let media_key of i.attachments.media_keys) {
        for (let media of tweetData.includes.media) {
          if (media_key === media.media_key) {
            mediaList.push(media);
          }
        }
      }
    }

    new Post({
      id: tweetId,
      created_at: created_at,
      text: text,
      author: author,
      media: mediaList,
      type: "twitter",
    }).save();
  }
};

export const checkDb = async (artist, tweetList) => {
  const Post = Mongoose.model(artist, twitterSchema);
  for (const id of tweetList) {
    Post.find({ id: id }, async (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        if (!docs.length) {
          update(artist, [id]);
        }
      }
    });
  }
};
