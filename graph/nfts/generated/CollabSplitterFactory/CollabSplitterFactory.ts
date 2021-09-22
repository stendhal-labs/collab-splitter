// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class SplitterCreated extends ethereum.Event {
  get params(): SplitterCreated__Params {
    return new SplitterCreated__Params(this);
  }
}

export class SplitterCreated__Params {
  _event: SplitterCreated;

  constructor(event: SplitterCreated) {
    this._event = event;
  }

  get splitter(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get recipients(): Array<Address> {
    return this._event.parameters[2].value.toAddressArray();
  }

  get amounts(): Array<BigInt> {
    return this._event.parameters[3].value.toBigIntArray();
  }
}

export class CollabSplitterFactory extends ethereum.SmartContract {
  static bind(address: Address): CollabSplitterFactory {
    return new CollabSplitterFactory("CollabSplitterFactory", address);
  }

  getSplitterImplementation(): Address {
    let result = super.call(
      "getSplitterImplementation",
      "getSplitterImplementation():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getSplitterImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getSplitterImplementation",
      "getSplitterImplementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateSplitterCall extends ethereum.Call {
  get inputs(): CreateSplitterCall__Inputs {
    return new CreateSplitterCall__Inputs(this);
  }

  get outputs(): CreateSplitterCall__Outputs {
    return new CreateSplitterCall__Outputs(this);
  }
}

export class CreateSplitterCall__Inputs {
  _call: CreateSplitterCall;

  constructor(call: CreateSplitterCall) {
    this._call = call;
  }

  get name_(): string {
    return this._call.inputValues[0].value.toString();
  }

  get merkleRoot(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get recipients(): Array<Address> {
    return this._call.inputValues[2].value.toAddressArray();
  }

  get amounts(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }
}

export class CreateSplitterCall__Outputs {
  _call: CreateSplitterCall;

  constructor(call: CreateSplitterCall) {
    this._call = call;
  }

  get newContract(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get splitterImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get owner_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetSplitterImplementationCall extends ethereum.Call {
  get inputs(): SetSplitterImplementationCall__Inputs {
    return new SetSplitterImplementationCall__Inputs(this);
  }

  get outputs(): SetSplitterImplementationCall__Outputs {
    return new SetSplitterImplementationCall__Outputs(this);
  }
}

export class SetSplitterImplementationCall__Inputs {
  _call: SetSplitterImplementationCall;

  constructor(call: SetSplitterImplementationCall) {
    this._call = call;
  }

  get implementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetSplitterImplementationCall__Outputs {
  _call: SetSplitterImplementationCall;

  constructor(call: SetSplitterImplementationCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}