#[test_only]
module memo_protocol::memo_protocol_tests {
    use memo_protocol::memo_protocol;
    use sui::test_scenario;

    #[test]
    fun test_emit_memo_success() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);
        let msg = b"Hello, Memo!";
        memo_protocol::emit_memo(msg, ctx);
        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = memo_protocol::EInvalidMessage)]
        fun test_emit_memo_empty_message() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);
        let msg = vector::empty<u8>();
        memo_protocol::emit_memo(msg, ctx);
        test_scenario::end(scenario);
    }

    #[test, expected_failure(abort_code = memo_protocol::EMessageTooLong)]
    fun test_emit_memo_too_long_message() {
        let mut scenario = test_scenario::begin(@0xA);
        let ctx = test_scenario::ctx(&mut scenario);
        let msg = make_long_msg();
        memo_protocol::emit_memo(msg, ctx);
        test_scenario::end(scenario);
    }

    fun make_long_msg(): vector<u8> {
        let mut v = vector::empty<u8>();
        let mut i = 0;
        while (i < 1025) {
            vector::push_back(&mut v, 65);
            i = i + 1;
        };
        v
    }
}
