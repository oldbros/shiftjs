[Documentation - v1.1.1](README.md) / Modules

# Documentation - v1.1.1

## Table of contents

### Variables

- [default](modules.md#default)

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `PersistentVector` | { `constructor`: (`count`: `number`, `shift`: `number`, `root`: `NodeArray32`, `tail`: `NodeArray32`) => [`PersistentVector`](modules.md#persistentvector) ; `count`: `number` ; `root`: `NodeArray32` ; `shift`: `number` ; `tail`: `NodeArray32` ; `EMPTY`: [`PersistentVector`](modules.md#persistentvector) ; `#tailOffset`: () => `number` ; `arrayFor`: (`i`: `number`) => `NodeArray32` ; `assocN`: (`i`: `number`, `val`: `number`) => [`PersistentVector`](modules.md#persistentvector) ; `cons`: (`val`: `number`) => [`PersistentVector`](modules.md#persistentvector) ; `nth`: (`i`: `number`) => `any` ; `pop`: () => [`PersistentVector`](modules.md#persistentvector)  } |
| `async` | `__module` |
| `compose` | (...`fns`: `any`[]) => (`args?`: `any`) => `any` |
| `curry` | (`fn`: `AnyFunc`) => `AnyFunc` |
| `partial` | (`fn`: `AnyFunc`, ...`args`: `any`[]) => `AnyFunc` |
| `partialObject` | (`fn`: `AnyFunc`, `props`: `any`) => `AnyFunc` |
| `partialObjectFirst` | (`fn`: `AnyFunc`, `props`: `any`) => `AnyFunc` |
| `partialObjectLast` | (`fn`: `AnyFunc`, `props`: `any`) => `AnyFunc` |
| `partialOne` | (`fn`: `AnyFunc`, `arg`: `any`) => `AnyFunc` |
| `partialReverse` | (`fn`: `AnyFunc`, ...`args`: `any`[]) => `AnyFunc` |
| `partialReverseOne` | (`fn`: `AnyFunc`, `arg`: `any`) => `AnyFunc` |
| `pipe` | (...`fns`: `any`[]) => (`args?`: `any`) => `any` |

#### Defined in

[shift.js:4](https://github.com/oldbros/shiftjs/blob/main/src/shift.js#L4)
