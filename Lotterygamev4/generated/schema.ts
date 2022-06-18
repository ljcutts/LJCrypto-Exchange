// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class LotteryGame extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("entryAmount", Value.fromBigInt(BigInt.zero()));
    this.set("winner", Value.fromBytesArray(new Array(0)));
    this.set("player", Value.fromBytesArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save LotteryGame entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type LotteryGame must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("LotteryGame", id.toString(), this);
    }
  }

  static load(id: string): LotteryGame | null {
    return changetype<LotteryGame | null>(store.get("LotteryGame", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get entryAmount(): BigInt {
    let value = this.get("entryAmount");
    return value!.toBigInt();
  }

  set entryAmount(value: BigInt) {
    this.set("entryAmount", Value.fromBigInt(value));
  }

  get winner(): Array<Bytes> {
    let value = this.get("winner");
    return value!.toBytesArray();
  }

  set winner(value: Array<Bytes>) {
    this.set("winner", Value.fromBytesArray(value));
  }

  get requestId(): Bytes | null {
    let value = this.get("requestId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set requestId(value: Bytes | null) {
    if (!value) {
      this.unset("requestId");
    } else {
      this.set("requestId", Value.fromBytes(<Bytes>value));
    }
  }

  get player(): Array<Bytes> {
    let value = this.get("player");
    return value!.toBytesArray();
  }

  set player(value: Array<Bytes>) {
    this.set("player", Value.fromBytesArray(value));
  }
}
