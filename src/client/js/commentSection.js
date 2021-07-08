import fetch from "node-fetch";

const screen = document.getElementById("screencontainer");

const commentform = document.getElementById("commentform");

const deleteSpan = document.getElementsByClassName("del");

const handleDel = async (e) => {
  const parent = e.target.parentNode;
  const commentID = parent.dataset.id;
  const res = await fetch(`/api/videos/${commentID}/delete`,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deleteId: commentID }),
  });
  console.log(res);
  if (res.status === 201){
    parent.parentNode.removeChild(parent);
  }
  else return;
};

Array.from(deleteSpan).forEach((e) => {
  e.addEventListener("click", handleDel);
});

const createComment = (text, id) => {
  const commentUl = document.querySelector(".comment__div ul");
  const li = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");

  span2.innerText = "✨";
  icon.className = "fas fa-comment";
  span.innerText = ` ${text}`;

  li.appendChild(icon);
  li.appendChild(span);
  li.appendChild(span2);
  li.dataset.id = id;
  span2.addEventListener("click", handleDel);
  commentUl.prepend(li);
};

const handleClick = async (e) => {
  e.preventDefault();
  const textarea = commentform.querySelector("textarea");
  const text = textarea.value;
  const videoID = screen.dataset.id;
  if (text === "") return;

  const res = await fetch(`/api/videos/${videoID}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  });
  textarea.value = "";
  if (res.status === 201) {
    console.log(res);
    const json = await res.json();
    console.log(json);
    createComment(text, json.commentId);
  }

  // window.location.reload();
};

if (commentform) commentform.addEventListener("submit", handleClick);
