import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// import packages
import { v4 as uuidv4 } from "uuid";
import timestamp from "time-stamp";
import month from "month";
import clock from "o-clock";

import data from "../data/data.json";

import ReplyCommentBox from "./ReplyCommentBox";

import iconPlus from "../../public/assets/icons/icon-plus.svg";
import iconMinus from "../../public/assets/icons/icon-minus.svg";
import iconReply from "../../public/assets/icons/icon-reply.svg";
import iconDelete from "../../public/assets/icons/icon-delete.svg";
import iconEdit from "../../public/assets/icons/icon-edit.svg";

import DeleteConfirmationBox from "./DeleteConfirmationBox";
import CurrentUser from "./CurrentUser";

export default function Comments() {
  const [datas, setDatas] = useState(data);
  const [deletedTargetId, setDeletedTargetId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const textareaRef = useRef(null);

  const curentDate = `${timestamp('DD')} ${month('MMM')} ${timestamp('YY')}`;
  const currentTime = `${curentDate}, ${clock('HH')}`;

  const upVoteComments = (e) => {
    const username = e.target.dataset.username;
    const id = e.target.dataset.id;

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
          if (comment.user.username === username) {
            return {
              ...comment, score: comment.score + 1,
            }
          }
          return comment;
        })
      }

      // sort comments based on their score
      updatedDatas.comments.sort((a, b) => b.score - a.score);

      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

      return updatedDatas;
    });

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
          return {
            ...comment, replies: comment.replies.map(reply => {
              if (reply.id == id) {
                return {
                  ...reply, score: reply.score + 1,
                }
              }
              return reply;
            })
          }
        })
      }

      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

      return updatedDatas;
    })
  }

  const downVoteComments = (e) => {
    const username = e.target.dataset.username;
    const id = e.target.dataset.id;

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
          if (comment.user.username === username) {
            return { ...comment, score: comment.score - 1 }
          }
          return comment
        })
      }

      // sort comments based on their score
      updatedDatas.comments.sort((a, b) => b.score - a.score);

      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

      return updatedDatas;
    })

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
          return {
            ...comment, replies: comment.replies.map(reply => {
              if (reply.id == id) {
                return {
                  ...reply, score: reply.score - 1,
                }
              }
              return reply;
            })
          }
        })
      }

      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

      return updatedDatas;
    })
  }

  const upVoteCommentsChild = (e) => {
    const id = e.target.dataset.id;

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
          return {
            ...comment, replies: comment.replies.map(reply => {
              return {
                ...reply, repliesChild: reply.repliesChild.map(replyChild => {
                  if (replyChild.id == id) {
                    return {
                      ...replyChild, score: replyChild.score + 1
                    }
                  }
                  return replyChild;
                })
              }
            })
          }
        })
      }
      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

      return updatedDatas;
    })
  }

  const downVoteCommentsChild = (e) => {
    const id = e.target.dataset.id;

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas,
        comments: oldSetDatas.comments.map(comment => ({
          ...comment,
          replies: comment.replies.map(reply => ({
            ...reply,
            repliesChild: reply.repliesChild.map(replyChild => (
              replyChild.id === id ? { ...replyChild, score: replyChild.score - 1 } : replyChild
            ))
          }))
        }))
      };
      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

      return updatedDatas;
    });
  }

  const replyClickedHandler = (e) => {
    const getWrapperComment = document.querySelector(`.wrapper-comment-${e.target.dataset.username}`);
    const getUsernameComment = e.target.dataset.username;

    const classClone = getWrapperComment.getAttribute('class').match('ml-6');

    if (e.target.parentNode.parentNode.dataset.typeComment === "reply") {
      createReplyCommentBox(getWrapperComment.parentNode, getUsernameComment, classClone)
    } else {
      createReplyCommentBox(getWrapperComment, getUsernameComment, classClone)
    }
  }

  const replyRamsesmironClickedHandler = (e) => {
    const getWrapperComment = document.querySelector(`.wrapper-comment-${e.target.dataset.username}`);
    const getUsernameComment = e.target.dataset.username;

    const classClone = getWrapperComment.children[1].getAttribute('class').match('ml-8');

    createReplyCommentBox(getWrapperComment, getUsernameComment, classClone)
  }

  const deleteCommentReply = useCallback((e) => {
    setShowDeleteConfirmation(true);
    setDeletedTargetId(e.target.dataset.id);
  }, [setShowDeleteConfirmation, setDeletedTargetId]);

  const deleteCommentReplyChild = useCallback((e) => {
    const deletedTargetId = e.target.dataset.id;
    setShowDeleteConfirmation(true);
    setDeletedTargetId(deletedTargetId);
  }, [setShowDeleteConfirmation, setDeletedTargetId]);

  const editButtonClicked = useCallback((id, replyingTo) => {
    setEditingId(id);
    setReplyingTo(replyingTo);
  }, [setEditingId, setReplyingTo]);

  const cancelUpdateClicked = useCallback(() => setEditingId(null), []);

  const updateButtonClicked = () => {
    const valueTextareaEditing = textareaRef.current.value;
    const updatedCommentReply = valueTextareaEditing.slice(replyingTo.length + 2);

    setDatas(oldSetDatas => {
      const updatedDatas = {
        ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
          return {
            ...comment, replies: comment.replies.map(reply => {
              if (reply.id == editingId) {
                return {
                  ...reply, content: updatedCommentReply
                }
              }
              return reply
            })
          }
        })
      }

      localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));
      setEditingId(null);
      return updatedDatas;
    })
  }

  const updateButtonReplyChildClicked = () => {
    const valueTextareaEditing = textareaRef.current.value;
    const updatedCommentReply = valueTextareaEditing.slice(replyingTo.length + 2);

    setDatas(prevDatas => (
      {
        ...prevDatas,
        comments: prevDatas.comments.map(comment => (
          {
            ...comment,
            replies: comment.replies.map(reply => (
              {
                ...reply,
                repliesChild: reply.repliesChild.map(replyChild =>
                  replyChild.id === editingId ? { ...replyChild, content: updatedCommentReply } : replyChild
                )
              }
            ))
          }
        ))
      }
    ));

    localStorage.setItem("updatedDatas", JSON.stringify(datas));
    setEditingId(null);
  }

  const createReplyCommentBox = useCallback((wrapperComments, username, classClone) => {
    const element = (
      <ReplyCommentBox username={username} datas={datas} setDatas={setDatas} currentDate={currentTime} classClone={classClone} />
    );
    const container = document.createElement('div');
    container.style.width = '100%';
    createRoot(container).render(element);
    wrapperComments.appendChild(container);
  }, [datas, setDatas, currentTime]);

  useEffect(() => {
    const storedUpdatedDatas = JSON.parse(localStorage.getItem("updatedDatas"));

    if (storedUpdatedDatas) {
      setDatas(storedUpdatedDatas);
    }
  }, []);

  return (
    <>
      <div className="relative space-y-5">
        {datas.comments.map(data => (
          <div key={uuidv4()} className={`space-y-5 wrapper-comment-${data.user.username} max-w-[45.625rem] mx-auto`}>
            {/* comments */}
            <div className="relative flex flex-col-reverse gap-3 p-[1.2rem] bg-white rounded-md items-start mobile-xl:flex-row mobile-xl:gap-5">
              {/* button upvote and downvote */}
              <div className="text-moderate-blue font-medium fill-[#C5C6EF] bg-light-gray rounded-lg p-2 text-sm text-center flex justify-center gap-3 w-[5.5rem] mobile-xl:flex-col mobile-xl:justify-between mobile-xl:items-center mobile-xl:py-5 mobile-xl:px-1 mobile-xl:gap-3 mobile-xl:basis-[4.5rem]">
                <div className="flex items-center justify-center text-center svg-container place-content-center">
                  <img onClick={upVoteComments} data-username={data.user.username} className="duration-[20ms] cursor-pointer ease-in-out" src={iconPlus} alt="Icon Plus" />
                </div>
                <p>{data.score}</p>
                <div className="flex items-center justify-center text-center svg-container place-content-center" onClick={downVoteComments}>
                  <img data-username={data.user.username} className="duration-[20ms] ease-in-out cursor-pointer" src={iconMinus} alt="Icon Minus" />
                </div>
              </div>

              {/* profile picture, date and the comment */}
              <div className="space-y-2">
                {/* profile picture username and date */}
                <div className="flex flex-wrap items-center gap-4">
                  <img className="w-8" src={data.user.image.webp} alt={`Profile picture of ${data.user.username}`} />
                  <h1 className="font-medium text-dark-blue">{data.user.username}</h1>
                  <p className="text-grayish-blue">{data.createdAt}</p>
                </div>

                {/* the comment */}
                <p className="text-grayish-blue">{data.content}</p>
              </div>

              {/* buttonr reply */}
              <button data-username={data.user.username} onClick={replyClickedHandler} className="absolute flex items-center gap-3 font-medium duration-75 ease-in-out bottom-6 mobile-xl:h-fit right-5 text-moderate-blue hover:opacity-90 mobile-xl:top-5 mobile-xl:right-6">
                <img className="relative block before:content-['Reply'] before:absolute before:left-0 before:top-0" data-username={data.user.username} src={iconReply} alt="Icon Reply" />
                Reply
              </button>
            </div>

            {/* replies */}
            <div className="space-y-3 relative before:content-[''] before:w-[1px] before:h-full before:absolute before:left-0 before:bg-slate-300 before:rounded-full">
              {data.replies.map(reply => (
                <div key={uuidv4()} className={`wrapper-comment-${reply.user.username}`}>
                  {/* replies */}
                  <div data-type-comment="reply" id={uuidv4()} className="mt-4 ml-6 space-y-5 wrapper-replies wrapper-comment-${reply.user.username}">
                    <div className="relative flex flex-col-reverse gap-3 p-[1.2rem] bg-white rounded-md items-start mobile-xl:flex-row mobile-xl:-space-x-5">
                      <div className="flex flex-wrap items-center justify-between w-full gap-3 mobile-xl:w-fit mobile-xl:gap-0">
                        {/* button upvote and downvote */}
                        <div className="text-moderate-blue font-medium fill-[#C5C6EF] bg-light-gray rounded-lg p-2 text-sm text-center flex justify-between w-[4.2rem] mobile-xl:flex-col mobile-xl:justify-between mobile-xl:items-center mobile-xl:py-5 mobile-xl:px-1 mobile-xl:gap-3 mobile-xl:basis-10">
                          <div className="flex items-center justify-center text-center svg-container place-content-center">
                            <img onClick={upVoteComments} data-username={reply.user.username} data-id={reply.id} className="duration-[20ms] cursor-pointer ease-in-out" src={iconPlus} alt="Icon Plus" />
                          </div>
                          <p>{reply.score}</p>
                          <div className="flex items-center justify-center text-center svg-container place-content-center" onClick={downVoteComments}>
                            <img data-username={reply.user.username} data-id={reply.id} className="duration-[20ms] ease-in-out cursor-pointer" src={iconMinus} alt="Icon Minus" />
                          </div>
                        </div>

                        {/* button delete, button edit and button update */}
                        <div className={`text-sm flex items-center gap-3 font-medium mobile-xl:h-fit flex-wrap mobile-xl:absolute mobile-xl:right-6 mobile-xl:top-6 ${editingId == reply.id ? "bottom-56 right-24" : ""}`}>
                          {!reply.replyStatus &&
                            <>
                              <div className="flex items-center gap-2 duration-75 ease-in-out cursor-pointer text-soft-red hover:opacity-90">
                                <img src={iconDelete} alt="Icon trash for delete" />
                                <button onClick={deleteCommentReply} data-id={reply.id}>Delete</button>
                              </div>
                              <div className="flex items-center gap-2 duration-75 ease-in-out cursor-pointer text-moderate-blue hover:opacity-90">
                                <img data-id={reply.id} data-replying-to={reply.replyingTo} src={iconEdit} alt="Icon pencil for edit" />
                                <button data-id={reply.id} onClick={() => editButtonClicked(reply.id, reply.replyingTo)}>Edit</button>
                              </div>
                            </>
                          }
                        </div>

                        {/* button cancel update and update */}
                        <div className={`${editingId == reply.id ? "flex items-center justify-end gap-2 mobile-xl:hidden" : "hidden"}`}>
                          {/* button cancel update */}
                          {editingId == reply.id ? (
                            <button data-id={reply.id} onClick={cancelUpdateClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-soft-red hover:opacity-90 hover:duration-75">Cancel</button>
                          ) : null}

                          {/* button update */}
                          {editingId == reply.id ? (
                            <button data-id={reply.id} onClick={updateButtonClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-moderate-blue hover:opacity-90 hover:duration-75">Update</button>
                          ) : null}
                        </div>
                      </div>

                      {/* profile picture, date and the comment */}
                      <div className="w-full space-y-2">
                        {/* profile picture username and date */}
                        <div className="flex flex-wrap items-center gap-3">
                          <img className="w-8" src={reply.user.image.webp} alt={`Profile picture of ${data.user.username}`} />
                          <h1 className="font-medium text-dark-blue">{reply.user.username}</h1>
                          {reply.statusUser ? <p className="px-2 py-[1px] text-sm text-white rounded-sm bg-moderate-blue">{reply.statusUser}</p> : ""}
                          <p className="text-grayish-blue">{reply.createdAt}</p>
                        </div>

                        {/* the comment */}
                        {editingId == reply.id ? (
                          <>
                            <textarea ref={textareaRef} rows={5} name={uuidv4()} defaultValue={`@${reply.replyingTo} ${reply.content}`} className="w-full px-3 py-2 border-[1px] rounded-md border-light-grayish-blue text-grayish-blue focus:outline-none focus:ring-1 focus:ring-dark-blue focus:cursor-pointer" id={uuidv4()}></textarea>
                          </>
                        ) : (
                          <p className="text-grayish-blue">
                            <span className="font-bold text-moderate-blue">{`@${reply.replyingTo}`}</span>
                            {` ${reply.content}`}
                          </p>
                        )}

                        {/* button cancel update and update */}
                        <div className={`${editingId == reply.id ? "hidden mobile-xl:flex mobile-xl:items-center mobile-xl:justify-end gap-2" : "hidden"}`}>
                          {/* button cancel update */}
                          {editingId == reply.id ? (
                            <button data-id={reply.id} onClick={cancelUpdateClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-soft-red hover:opacity-90 hover:duration-75">Cancel</button>
                          ) : null}

                          {/* button update */}
                          {editingId == reply.id ? (
                            <button data-id={reply.id} onClick={updateButtonClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-moderate-blue hover:opacity-90 hover:duration-75">Update</button>
                          ) : null}
                        </div>
                      </div>

                      {/* button reply */}
                      {reply.replyStatus &&
                        <button data-username={reply.user.username} onClick={replyRamsesmironClickedHandler} className="absolute flex items-center gap-3 font-medium duration-75 ease-in-out bottom-6 mobile-xl:h-fit right-5 text-moderate-blue hover:opacity-90 mobile-xl:top-5 mobile-xl:right-6">
                          <img data-username={reply.user.username} src={iconReply} alt="Icon Reply" />
                          Reply
                        </button>}
                    </div>
                  </div>

                  {/* repliesChild */}
                  {reply.repliesChild !== undefined &&
                    <div className="relative before:content-[''] before:w-[1px] before:h-full before:absolute before:left-0 before:bg-slate-300 before:rounded-full ml-8 mt-5 space-y-5">
                      {reply.repliesChild.map(reply => (
                        <div key={uuidv4()} id={uuidv4()} className="px-3 mt-3 ml-5 space-y-5 wrapper-repliesChild">
                          <div className="relative flex flex-col-reverse gap-3 p-[1.2rem] bg-white rounded-md items-start mobile-xl:flex-row mobile-xl:-space-x-10">
                            <div className="flex flex-wrap items-center justify-between w-full gap-3 mobile-xl:w-fit mobile-xl:gap-0 mobile-xl:justify-start mobile-xl:items-start">
                              {/* button upvote and downvote */}
                              <div className="text-moderate-blue font-medium fill-[#C5C6EF] bg-light-gray rounded-lg p-2 text-sm text-center flex justify-center gap-3 w-[5.5rem] mobile-xl:flex-col mobile-xl:items-center mobile-xl:basis-10 mobile-xl:px-2 mobile-xl:py-4">
                                <div className="flex items-center justify-center text-center svg-container place-content-center">
                                  <img onClick={upVoteCommentsChild} data-username={reply.user.username} data-id={reply.id} className="duration-[20ms] cursor-pointer ease-in-out" src={iconPlus} alt="Icon Plus" />
                                </div>
                                <p>{reply.score}</p>
                                <div className="flex items-center justify-center text-center svg-container place-content-center" onClick={downVoteCommentsChild}>
                                  <img data-username={reply.user.username} data-id={reply.id} className="duration-[20ms] ease-in-out cursor-pointer" src={iconMinus} alt="Icon Minus" />
                                </div>
                              </div>

                              {/* button delete and edit */}
                              <div className={`text-sm flex items-center gap-3 font-medium mobile-xl:h-fit flex-wrap mobile-xl:absolute mobile-xl:right-6 mobile-xl:top-6 ${editingId == reply.id ? "bottom-56 right-24" : ""}`}>
                                {!reply.replyStatus &&
                                  <>
                                    <div className="flex items-center gap-2 duration-75 ease-in-out cursor-pointer text-soft-red hover:opacity-90">
                                      <img src={iconDelete} data-id={reply.id} alt="Icon trash for delete" />
                                      <button onClick={deleteCommentReplyChild} data-id={reply.id}>Delete</button>
                                    </div>
                                    <div className="flex items-center gap-2 duration-75 ease-in-out cursor-pointer text-moderate-blue hover:opacity-90">
                                      <img data-id={reply.id} data-replying-to={reply.replyingTo} src={iconEdit} alt="Icon pencil for edit" />
                                      <button data-id={reply.id} data-replying-to={reply.replyingTo} onClick={() => editButtonClicked(reply.id, reply.replyingTo)}>Edit</button>
                                    </div>
                                  </>
                                }
                              </div>

                              {/* button cancel update and update */}
                              <div className={`${editingId == reply.id ? "flex items-center justify-end gap-2 mobile-xl:hidden" : "hidden"}`}>
                                {/* button cancel update */}
                                {editingId == reply.id ? (
                                  <button data-id={reply.id} onClick={cancelUpdateClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-soft-red hover:opacity-90 hover:duration-75">Cancel</button>
                                ) : null}

                                {/* button update */}
                                {editingId == reply.id ? (
                                  <button data-id={reply.id} onClick={updateButtonReplyChildClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-moderate-blue hover:opacity-90 hover:duration-75">Update</button>
                                ) : null}
                              </div>
                            </div>

                            {/* profile picture, date and the comment */}
                            <div className="w-full space-y-2">
                              {/* profile picture username and date */}
                              <div className="flex flex-wrap items-center gap-4">
                                <img className="w-8" src={reply.user.image.webp} alt={`Profile picture of ${data.user.username}`} />
                                <h1 className="font-medium text-dark-blue">{reply.user.username}</h1>
                                {reply.statusUser ? <p className="px-2 py-[1px] text-sm text-white rounded-sm bg-moderate-blue">{reply.statusUser}</p> : ""}
                                <p className="text-grayish-blue">{reply.createdAt}</p>
                              </div>

                              {/* the comment */}
                              {editingId == reply.id ? (
                                <>
                                  <textarea ref={textareaRef} rows={5} name={uuidv4()} defaultValue={`@${reply.replyingTo} ${reply.content}`} className="w-full px-3 py-2 border-[1px] rounded-md border-light-grayish-blue text-grayish-blue focus:outline-none focus:ring-1 focus:ring-dark-blue focus:cursor-pointer" id={uuidv4()}></textarea>

                                  <div className="hidden mobile-xl:flex mobile-xl:justify-end mobile-xl:ml-auto mobile-xl:space-x-3">
                                    {/* button cancel update */}
                                    {editingId == reply.id ? (
                                      <button data-id={reply.id} onClick={cancelUpdateClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-soft-red hover:opacity-90 hover:duration-75">Cancel</button>
                                    ) : null}

                                    {/* button update */}
                                    {editingId == reply.id ? (
                                      <button data-id={reply.id} onClick={updateButtonReplyChildClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-moderate-blue hover:opacity-90 hover:duration-75">Update</button>
                                    ) : null}
                                  </div>
                                </>
                              ) : (
                                <p className="text-grayish-blue">
                                  <span className="font-bold text-moderate-blue">{`@${reply.replyingTo}`}</span>
                                  {` ${reply.content}`}
                                </p>
                              )}
                            </div>

                            {/* button reply */}
                            {reply.replyStatus && <button data-username={reply.user.username} onClick={replyClickedHandler} className="absolute flex items-center gap-3 font-medium duration-75 ease-in-out bottom-6 mobile-xl:h-fit right-5 text-moderate-blue hover:opacity-90 mobile-xl:top-5 mobile-xl:right-6">
                              <img data-username={reply.user.username} src={iconReply} alt="Icon Reply" />
                              Reply
                            </button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* current user component */}
        <CurrentUser datas={datas} setDatas={setDatas} currentDate={currentTime} />

        {/* delete confirmation */}
        {showDeleteConfirmation ? <DeleteConfirmationBox showDeleteConfirmation={showDeleteConfirmation} setShowDeleteConfirmation={setShowDeleteConfirmation} deletedTargetId={deletedTargetId} datas={datas} setDatas={setDatas} /> : null}
      </div>
    </>
  )
}
