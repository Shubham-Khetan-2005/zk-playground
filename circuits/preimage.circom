pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/poseidon.circom";

template Preimage() {
    signal input x;        // private
    signal output hash;    // public
    component h = Poseidon(1);
    h.inputs[0] <== x;
    hash <== h.out;
}

component main = Preimage();
