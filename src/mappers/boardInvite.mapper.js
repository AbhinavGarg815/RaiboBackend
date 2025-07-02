import {
    RaiBoardInviteResponse
} from '../models/board.response.models.js';

const mapRaiBoardInviteToResponse = (invite, board) => {
    if (!invite) {
        return null;
    }

    // Ensure inviter and boardId are populated before accessing their properties
    return new RaiBoardInviteResponse({
        inviterName: invite.inviter.fullname,
        inviterEmail: invite.inviter.email,
        role: invite.role,
        boardName: board.name,
        numberOfProducts: board.products.length,
        id : invite._id,
        createdAt : invite.createdAt,
        expiresAt : invite.expiresAt,
        status : invite.status
    });
};

export {
    mapRaiBoardInviteToResponse
};