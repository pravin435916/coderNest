import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // You can use other themes as per your preference

export const PostContent = ({ content,code }) => {
  useEffect(() => {
    Prism.highlightAll(); // Ensure syntax highlighting is applied
  }, [code]);

  return (
    <>

    <span>{content}</span>
    {
      code && (
        <pre className="language-javascript mt-2 rounded-md p-4 bg-gray-800 text-white">
          <code className="language-javascript">
            {code}
          </code>
        </pre>
      )
    }
    </>
  );
};
