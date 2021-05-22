import {
    SubmissionStream
} from 'snoostorm';
import dotenv from 'dotenv'
import Snoowrap from 'snoowrap';

dotenv.config()

const creds = {
    userAgent: process.env.REDDIT_BOT_UA,
    clientId: process.env.REDDIT_PUBLIC_KEY,
    clientSecret: process.env.REDDIT_SECRET_KEY,
    username: process.env.REDDIT_BOT_UNAME,
    password: process.env.REDDIT_BOT_PWORD,
}

const client = new Snoowrap(creds);

const submissions = new SubmissionStream(client, {
    subreddit: 'all',
    limit: 25,
    pollTime: 2000,
});

const linkExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
const re = new RegExp(linkExp)

submissions.on('item', (post) => {
    const postId = post.id

    if (post.title.match(re)) {
        const link = re.exec(post.title)[0]

        console.log('Found a post to reply to: ' + link + '\n' + post.id + '\n\n')
        client.getSubmission(postId).reply('Bippity boppity, I found a link in your header: ' + link + '\n\n---\n^(Hey, this was done by a bot. | [support](https://github.com/alechash/linkable-headers/issues) | [github source code](https://github.com/alechash/linkable-headers) | [MIT License](https://github.com/alechash/linkable-headers/blob/main/LICENSE))')
    }
});