export class Post{
constructor( public postId: string, public postTitle: string, public postContent: string, public imagePath, public creator: string, public createdAt: string) {
    this.postId = postId;
    this.postTitle = postTitle;
    this.postContent = postContent;
    this.imagePath = imagePath;
    this.creator = creator;
    this.createdAt = createdAt
}
}