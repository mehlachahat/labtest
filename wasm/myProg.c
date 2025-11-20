// wasm/myProg.c
#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE
int modexp(int a, int b, int p) {
    long long result = 1;
    long long base = a % p;

    while (b > 0) {
        if (b & 1)
            result = (result * base) % p;

        base = (base * base) % p;
        b >>= 1;
    }
    return (int)result;
}