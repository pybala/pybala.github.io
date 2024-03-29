import React, { useState } from 'react'
import { TagCloud } from 'react-tagcloud'
import { navigate } from 'gatsby'
import { TagList } from '../utils/tag-list'

/*
const tagsData = [
  { value: 'jQuery', count: 25 },
  { value: 'MongoDB', count: 18 },
  { value: 'JavaScript', count: 38 },
]
*/

const AppTagCloud = () => {
    const [active, setActive] = useState(false);
    const tagsData = TagList()

    //const showTags = () => setActive(true);
    const showTags = () => {
      document.querySelector(".site-overlay").style.display = "block";
      setActive(true);
    }
    const hideTags = () => {  
      document.querySelector(".site-overlay").style.display = "none";
      setActive(false);
    }

    const customRenderer = (tag, size, color) => {
      return (
        <span key={tag.value} style={{ color }} className={`tag-${size}`}>
          {tag.value}
        </span>
      )
    }    

    return (
      <div className="nav-tagcloud">
        <span onClick={showTags} onKeyDown={showTags} className="leftnav-link">Tags</span>
        <div className="tagcloud-wrapper" style={{display: active ? 'block' : 'none' }}>
            <span onClick={hideTags} onKeyDown={hideTags} class="tagcloud-close">×</span>
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={tagsData}
              className="tagcloud-cont"
              // renderer={customRenderer}
              onClick={tag => navigate(`/tags/${tag.value}`)}
            />
        </div>
      </div>
    )
}

export default AppTagCloud;
