class RaiBoardInviteResponse {
    constructor({id, inviterName, inviterEmail, role, boardName, numberOfProducts, expiresAt, createdAt, status }) {
        this.inviterName = inviterName;
        this.inviterEmail = inviterEmail;
        this.role = role;
        this.boardName = boardName;
        this.numberOfProducts = numberOfProducts;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.id = id;
        this.status = status;
    }
}

export { RaiBoardInviteResponse };