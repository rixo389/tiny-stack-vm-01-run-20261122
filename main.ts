import {readdirSync, readFileSync, mkdirSync, writeFileSync} from "node:fs";
const I = process.env.MAKEFUN_INPUT_DIR || "/input", O = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const B = {16:(a,b)=>(a+b)|0,17:(a,b)=>(a-b)|0,18:Math.imul,19:(a,b)=>(a/b)|0,20:(a,b)=>(a%b)|0,21:(a,b)=>((a>>>0)/(b>>>0))|0,22:(a,b)=>((a>>>0)%(b>>>0))|0,24:(a,b)=>a&b,25:(a,b)=>a|b,26:(a,b)=>a^b,28:(a,b)=>a<<b,29:(a,b)=>a>>b,30:(a,b)=>(a>>>b)|0,32:(a,b)=>a===b?1:0,33:(a,b)=>a<b?1:0,34:(a,b)=>(a>>>0)<(b>>>0)?1:0};
function run(P, D) {
  const S = [], C = [], M = new Int32Array(256);
  let p = 0, s = 0, d = 0;
  const o = [];
  const T = c => [o, c];
  for (;;) {
    if (s >= 1e6) return T(10);
    if (p < 0 || p >= P.length) return T(9);
    const op = P[p];
    let n = 1, v = 0;
    if (op === 1) n = 2;
    else if (op === 2) n = 5;
    else if (op >= 48 && op <= 51) n = 3;
    if (p + n > P.length) return T(9);
    if (n === 2) v = (P[p + 1] << 24) >> 24;
    else if (n === 5) v = P[p + 1] | P[p + 2] << 8 | P[p + 3] << 16 | P[p + 4] << 24;
    else if (n === 3) v = P[p + 1] | P[p + 2] << 8;
    const q = p + n;
    const j = ((v << 16) >> 16);
    s++;
    let a = 0, b = 0, r = 0;
    switch (op) {
      case 0: return T(0);
      case 1: case 2:
        if (S.length > 255) return T(3);
        S.push(v); p = q; break;
      case 3:
        if (!S.length) return T(2);
        S.pop(); p = q; break;
      case 4:
        if (!S.length) return T(2);
        if (S.length > 255) return T(3);
        S.push(S[S.length - 1]); p = q; break;
      case 5:
        if (S.length < 2) return T(2);
        b = S.pop(); a = S.pop(); S.push(b, a); p = q; break;
      case 6:
        if (S.length < 2) return T(2);
        if (S.length > 255) return T(3);
        S.push(S[S.length - 2]); p = q; break;
      case 7:
        if (S.length < 3) return T(2);
        b = S.pop(); a = S.pop(); r = S.pop(); S.push(a, b, r); p = q; break;
      case 16: case 17: case 18: case 19: case 20: case 21: case 22:
      case 24: case 25: case 26: case 28: case 29: case 30:
      case 32: case 33: case 34:
        if (S.length < 2) return T(2);
        b = S.pop(); a = S.pop();
        if (op > 18 && op < 23 && !b) return T(4);
        S.push(B[op](a, b)); p = q; break;
      case 23:
        if (!S.length) return T(2);
        S.push((-S.pop()) | 0); p = q; break;
      case 27:
        if (!S.length) return T(2);
        S.push(~S.pop()); p = q; break;
      case 48:
        p = q + j; break;
      case 49:
        if (!S.length) return T(2);
        p = S.pop() === 0 ? q + j : q; break;
      case 50:
        if (!S.length) return T(2);
        p = S.pop() !== 0 ? q + j : q; break;
      case 51:
        if (C.length > 63) return T(7);
        C.push(q); p = v; break;
      case 52:
        if (!C.length) return T(8);
        p = C.pop(); break;
      case 64:
        if (!S.length) return T(2);
        a = S.pop();
        if (a < 0 || a > 255) return T(6);
        S.push(M[a]); p = q; break;
      case 65:
        if (S.length < 2) return T(2);
        a = S.pop(); b = S.pop();
        if (a < 0 || a > 255) return T(6);
        M[a] = b; p = q; break;
      case 80:
        if (!S.length) return T(2);
        a = S.pop();
        { const t = String(a); if (o.length + t.length > 65536) return T(11); o.push(...Buffer.from(t)); }
        p = q; break;
      case 81:
        if (!S.length) return T(2);
        a = S.pop();
        if (o.length + 1 > 65536) return T(11);
        o.push(a & 255); p = q; break;
      case 82:
        if (S.length > 255) return T(3);
        S.push(d < D.length ? D[d++] : -1); p = q; break;
      case 83:
        if (!S.length) return T(2);
        return T(S.pop() & 255);
      default: return T(5);
    }
  }
}
const rf = x => { try { return readFileSync(x); } catch { return Buffer.alloc(0); } };
for (const e of readdirSync(I, {withFileTypes: true}).filter(e => e.isDirectory()).map(e => e.name).sort()) {
  const [o, c] = run(rf(I + "/" + e + "/program.bin"), rf(I + "/" + e + "/input.bin"));
  mkdirSync(O + "/" + e, {recursive: true});
  writeFileSync(O + "/" + e + "/stdout.bin", Buffer.from(o));
  writeFileSync(O + "/" + e + "/exit.txt", c + "\n");
}
