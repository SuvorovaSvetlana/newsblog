function renderPosts(res){
      res.forEach((item) => {
            const allNews = document.getElementById('allNews');
            const news = document.createElement('div');
            const newsCard = document.createElement('div');
            const forContent = document.createElement('div');
            const imgDiv = document.createElement('div');
            const postImg = document.createElement('img');
            const forPost = document.createElement('div');
            const post = document.createElement('div');
            const postTitle = document.createElement('h5');
            const postText = document.createElement('p');
            const postInfo = document.createElement('p');

            news.setAttribute('class','news');
            news.setAttribute('id','news');
            news.setAttribute('data-id', item.postId)
            newsCard.setAttribute('class', 'card mb-3');
            newsCard.setAttribute('id', 'newsCard"');
            forContent.setAttribute('class', 'row g-0');
            forContent.setAttribute('id', 'forImgDiv');
            imgDiv.setAttribute('class','col-md-4');
            imgDiv.setAttribute('id', 'imgDiv');
            postImg.src = './images/news.jpg';
            postImg.setAttribute('class', 'img-fluid rounded-start');
            postImg.setAttribute('id', 'postImg');
            forPost.setAttribute('class', 'col-md-8');
            forPost.setAttribute('id', 'forPost');
            post.setAttribute('class', 'card-body')
            post.setAttribute('id', 'post');
            postTitle.setAttribute('class', 'card-title');
            postTitle.setAttribute('id', 'postTitle');
            postText.setAttribute('class', 'card-text');
            postText.setAttribute('id', 'postText')
            postInfo.setAttribute('class', 'card-text');
            postInfo.setAttribute('id', 'postInfo');

            postTitle.textContent = item.posttitle;
            postText.textContent = item.postText;
            postInfo.textContent = item.postInfo;

            allNews.appendChild(news);
            news.appendChild(newsCard);
            newsCard.appendChild(forContent);
            forContent.appendChild(imgDiv);
            imgDiv.appendChild(postImg);
            forContent.appendChild(forPost);
            forPost.appendChild(post);
            post.appendChild(postTitle);
            post.appendChild(postText);
            post.appendChild(postInfo);
      });

      let oneNews = document.getElementById('news')
      oneNews.addEventListener('click', ()=>{
            let id = item.postId;
            console.log(id)
           fetch('http://localhost:3000/posts/${item.postId}')
            .then(res => res.json())
            .then(res => console.log(res))
      })

  
}
export {renderPosts};