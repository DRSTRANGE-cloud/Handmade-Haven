import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from 'contentful';
import formatDate from '../utils/formatDate';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Loader from '../components/Loader';

const CONTENTFUL_SPACE_ID = 'fypy5qogy93n';
const CONTENTFUL_ACCESS_TOKEN = 'BdRsoOCQ5JVl8mm8Q4jo8Etu8W6_-VU1E6YNOzxNDk0';

const SingleBlogScreen = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();

  const client = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  const fetchBlog = useCallback(async () => {
    try {
      const entries = await client.getEntries({
        content_type: 'blog',
        'fields.slug': slug,
      });
      const blogEntry = entries.items[0];
      if (blogEntry) {
        setBlog(blogEntry.fields);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  }, [client, slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h1>{blog.title}</h1>
      </div>

      <div className="section section-center single-blog">
        <article className="single-blog-img">
          {blog.image?.fields?.file?.url && (
            <img src={blog.image.fields.file.url} alt={blog.title} />
          )}
        </article>

        <article className="single-blog-header">
          <span className="blog-date">
            <i className="far fa-calendar"></i>{' '}
            {blog.date && formatDate(blog.date)}
          </span>
          <span className="blog-category">{blog.category}</span>
        </article>

        <article className="single-blog-content">
          {blog.content && documentToReactComponents(blog.content)}
        </article>
      </div>
    </section>
  );
};

export default SingleBlogScreen;
