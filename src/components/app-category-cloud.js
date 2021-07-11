import React, { useState } from 'react'
import { TagCloud } from 'react-tagcloud'
import { navigate } from 'gatsby'
import { CategoryList } from '../utils/category-list'

/*
const tagsData = [
  { value: 'jQuery', count: 25 },
  { value: 'MongoDB', count: 18 },
  { value: 'JavaScript', count: 38 },
]
*/

const AppCategoryCloud = () => {
    const [active, setActive] = useState(false);
    const tagsData = CategoryList()

    //const showTags = () => setActive(true);
    const showTags = () => {
      document.querySelector(".site-overlay").style.display = "block";
      setActive(true);
    }
    const hideTags = () => {
      document.querySelector(".site-overlay").style.display = "none";
      setActive(false);
    }

    return (
      <div className="nav-tagcloud">
        <span onClick={showTags} className="leftnav-link">Categories</span>
        <div className="tagcloud-wrapper" style={{display: active ? 'block' : 'none' }}>
            <span onClick={hideTags} class="tagcloud-close">×</span>
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={tagsData}
              className="tagcloud-cont"
              onClick={category => navigate(`/categories/${category.value}`)}
            />
        </div>
      </div>
    )
}

export default AppCategoryCloud;
