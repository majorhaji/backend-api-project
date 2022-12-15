const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");

require("jest-sorted");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("/api/topics", () => {
  it("responds with a 200 status code and all the topic data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/articles", () => {
  it("responds with a 200 status code and an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("is sorted by date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSorted({
          descending: true,
          key: "created_at",
        });
      });
  });
});

describe("get article by id", () => {
  it("200: resolves with article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article[0];
        expect(article.article_id).toBe(1);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
          })
        );
      });
  });

  it("404: returns message if it cannot find article with that id", () => {
    return request(app)
      .get("/api/articles/344")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });

  it("400: returns bad path message", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });
});

describe("get comments by article id", () => {
  it("200: most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSorted({
          descending: true,
          key: "created_at",
        });
      });
  });
  it("404: returns message if article id doesn't exist", () => {
    return request(app)
      .get("/api/articles/404044/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });

  it("400: returns message if bad request", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { msg } }) => expect(msg).toBe("Bad request"));
  });

  it("200: returns comments for given id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  it("200: sends back empty array if no comments", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
});

describe("POST to /api/articles/:article_id/comments", () => {
  it("201: Posts req body to comments table with article id, returns posted ", () => {
    const newComment = { username: "butter_bridge", body: "Made pasta today" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .then(({ body: { comment } }) => {
        expect(comment[0]).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "Made pasta today",
            votes: expect.any(Number),
            author: "butter_bridge",
            article_id: 2,
            created_at: expect.any(String),
          })
        );
      });
  });

  it("400: Content in request body has missing property", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Request isn't formatted correctly");
      });
  });

  it("400: Non string is given as username ", () => {
    const newComment = {
      username: 1,
      body: "Pizza",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Request isn't formatted correctly");
      });
  });

  it("400: Bad path", () => {
    const newComment = {
      username: "butter_bridge",
      body: "lala",
    };
    return request(app)
      .post("/api/articles/apple/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("404: invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "hi",
    };
    return request(app)
      .post("/api/articles/3048432/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});

describe("Patch /api/articles/:article_id", () => {
  it("200: responds with article with updated vote", () => {
    const updatedVote = { inc_votes: 500 };

    return request(app)
      .post("/api/articles/1")
      .send(updatedVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article[0].votes).toBe(600);
      });
  });

  it("404: responds with message if article id doesn't exist", () => {
    const updatedVote = { inc_votes: 500 };
    return request(app)
      .post("/api/articles/3048")
      .send(updatedVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });

  it("400: responds with message if request body doesn't have integer", () => {
    const updatedVote = { inc_votes: "banana" };
    return request(app)
      .post("/api/articles/1")
      .send(updatedVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Request not formatted correctly");
      });
  });

  it("400: if body is empty, returns article", () => {
    const updatedVote = {};
    return request(app)
      .post("/api/articles/1")
      .send(updatedVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Request not formatted correctly");
      });
  });

  it("200: votes empty", () => {
    const updatedVote = { inc_votes: -100 };
    return request(app)
      .post("/api/articles/2")
      .send(updatedVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article[0].votes).toBe(-100);
      });
  });

  it("400: bad path", () => {
    const updatedVote = { inc_votes: -100 };
    return request(app)
      .post("/api/articles/banana")
      .send(updatedVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("get users", () => {
  it("200: returns users with username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.stringContaining("https://"),
            })
          );
        });
      });
  });
});

describe("Error handling", () => {
  it("returns a custom 404 error message", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual(
          "You tried to look for something and it wasn't found"
        );
      });
  });
});
