import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { createClient } from 'contentful';

const CONTENTFUL_SPACE_ID = 'fypy5qogy93n';
const CONTENTFUL_ACCESS_TOKEN = 'BdRsoOCQ5JVl8mm8Q4jo8Etu8W6_-VU1E6YNOzxNDk0';

// ✅ Move client outside the component to avoid re-creation on every render
const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

const BlogScreen = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const entries = await client.getEntries();
      const allBlogs = entries.items;
      setBlogs(allBlogs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []); // ✅ Dependency array is fine here

  return (
    <section>
      <div className="section-header">
        <h1>Handmade Haven Blog</h1>
      </div>

      <div className="section blogs-center section-center">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard key={blog.sys.id} blog={blog.fields} />
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </section>
  );
};

export default BlogScreen;
