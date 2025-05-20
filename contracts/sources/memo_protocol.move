module memo_protocol::memo_protocol {
    use sui::event;

    /// Error codes
    const EInvalidMessage: u64 = 0;
    const EMessageTooLong: u64 = 1;

    const MAX_MESSAGE_LENGTH: u64 = 1024;

    public struct MemoEvent has copy, drop, store {
        sender: address,
        message: vector<u8>
    }

    public entry fun emit_memo(msg: vector<u8>, ctx: &mut TxContext) {
        assert!(vector::length(&msg) > 0, EInvalidMessage);
        assert!(vector::length(&msg) <= MAX_MESSAGE_LENGTH, EMessageTooLong);

        let sender = tx_context::sender(ctx);

        event::emit(MemoEvent {
            sender,
            message: msg
        });
    }
}
