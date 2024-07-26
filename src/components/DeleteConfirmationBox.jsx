import { useRef } from "react"
import PropTypes from "prop-types"

export default function DeleteConfirmationBox({ showDeleteConfirmation, setShowDeleteConfirmation, deletedTargetId, setDatas }) {
 const deleteCommentRef = useRef(null);
 const cancelDeleteCommentRef = useRef(null);

 const deleteSelectedComment = () => {
  setDatas(oldSetDatas => {
   const comments = oldSetDatas.comments.map(comment => {
    const replies = comment.replies.filter(reply => reply.id != deletedTargetId);

    comment.replies.map(reply => {
     reply.repliesChild = reply.repliesChild.filter(replyChild => replyChild.id != deletedTargetId);
    })

    return { ...comment, replies }
   });

   const contents = oldSetDatas.currentUser.contents.filter(content => content.id != deletedTargetId)
   const currentUser = { ...oldSetDatas.currentUser, contents }

   const updatedDatas = { ...oldSetDatas, comments, currentUser }

   setDatas(updatedDatas);
   localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));
   return updatedDatas;
  })
  setShowDeleteConfirmation(false);
 }

 const cancelDeleteComment = () => setShowDeleteConfirmation(false);

 return (
  <>
   <div className="before:content-[''] before:fixed before:left-0 before:top-0 before:w-screen before:h-screen before:bg-black before:opacity-60 animate__animated animate__fadeIn">
    <div className={`${showDeleteConfirmation ? "text-center fixed -translate-x-1/2 top-40 left-1/2 max-w-96 md:top-1/2 md:-translate-y-1/2" : "hidden"}`}>
     <div className="max-w-[23.75rem] mx-auto flex flex-col justify-center p-6 space-y-4 bg-white rounded-lg">
      <h2 className="text-lg font-bold text-dark-blue">Delete comment</h2>

      <p className="text-grayish-blue">Are you sure you want to delete this comment? This will remove the comment and can&rsquo;t be undone.</p>

      <div className="flex items-center justify-center gap-4 text-white">
       <button ref={cancelDeleteCommentRef} onClick={cancelDeleteComment} className="px-5 py-2 uppercase duration-75 ease-in-out rounded-md bg-grayish-blue hover:bg-dark-blue">No, cancel</button>
       <button ref={deleteCommentRef} onClick={deleteSelectedComment} className="px-5 py-2 uppercase duration-75 ease-in-out rounded-md bg-soft-red hover:bg-pale-red">Yes, delete</button>
      </div>
     </div>
    </div>
   </div>
  </>
 )
}

DeleteConfirmationBox.propTypes = {
 showDeleteConfirmation: PropTypes.bool.isRequired,
 setShowDeleteConfirmation: PropTypes.func.isRequired,
 deletedTargetId: PropTypes.string.isRequired,
 setDatas: PropTypes.func.isRequired,
 datas: PropTypes.object.isRequired,
};
