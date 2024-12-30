export class CommentPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHTTPResponse(comment: any) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
