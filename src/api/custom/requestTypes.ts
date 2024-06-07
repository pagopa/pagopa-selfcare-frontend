import * as r from "@pagopa/ts-commons/lib/requests";
import * as t from "io-ts";
import {ProblemJson} from "../generated/portal/ProblemJson";
import {updateInstitutionsDefaultResponses, UpdateInstitutionsResponsesT} from "../generated/portal/requestTypes";

export type UpdateInstitutionsT = r.IPostApiRequestType<
    { readonly JWT: string; readonly body: string; readonly file: File | null },
    "Content-Type" | "Authorization",
    never,
    | r.IResponseType<200, undefined, "X-Request-Id">
    | r.IResponseType<400, ProblemJson, "X-Request-Id">
    | r.IResponseType<401, undefined, "X-Request-Id">
    | r.IResponseType<403, undefined, "X-Request-Id">
    | r.IResponseType<429, undefined, "X-Request-Id">
    | r.IResponseType<500, ProblemJson, "X-Request-Id">
>;

export function updateInstitutionsDecoder<
    A0 = undefined,
    C0 = undefined,
    A1 = ProblemJson,
    C1 = ProblemJson,
    A2 = undefined,
    C2 = undefined,
    A3 = undefined,
    C3 = undefined,
    A4 = undefined,
    C4 = undefined,
    A5 = ProblemJson,
    C5 = ProblemJson
>(
    overrideTypes:
        | Partial<
        UpdateInstitutionsResponsesT<
            A0,
            C0,
            A1,
            C1,
            A2,
            C2,
            A3,
            C3,
            A4,
            C4,
            A5,
            C5
        >
    >
        | t.Type<A0, C0>
        | undefined = {}
): r.ResponseDecoder<
    | r.IResponseType<200, A0, "X-Request-Id">
    | r.IResponseType<400, A1, "X-Request-Id">
    | r.IResponseType<401, A2, "X-Request-Id">
    | r.IResponseType<403, A3, "X-Request-Id">
    | r.IResponseType<429, A4, "X-Request-Id">
    | r.IResponseType<500, A5, "X-Request-Id">
> {
    const isDecoder = (d: any): d is t.Type<A0, C0> =>
        // eslint-disable-next-line @typescript-eslint/dot-notation
        typeof d["_A"] !== "undefined";

    const type = {
        ...((updateInstitutionsDefaultResponses as unknown) as UpdateInstitutionsResponsesT<
            A0,
            C0,
            A1,
            C1,
            A2,
            C2,
            A3,
            C3,
            A4,
            C4,
            A5,
            C5
        >),
        ...(isDecoder(overrideTypes) ? {200: overrideTypes} : overrideTypes)
    };

    const d200 = (type[200].name === "undefined"
        ? r.constantResponseDecoder<undefined, 200, "X-Request-Id">(200, undefined)
        : r.ioResponseDecoder<
            200,
            typeof type[200]["_A"],
            typeof type[200]["_O"],
            "X-Request-Id"
        >(200, type[200])) as r.ResponseDecoder<
        r.IResponseType<200, A0, "X-Request-Id">
    >;

    const d400 = (type[400].name === "undefined"
        ? r.constantResponseDecoder<undefined, 400, "X-Request-Id">(400, undefined)
        : r.ioResponseDecoder<
            400,
            typeof type[400]["_A"],
            typeof type[400]["_O"],
            "X-Request-Id"
        >(400, type[400])) as r.ResponseDecoder<
        r.IResponseType<400, A1, "X-Request-Id">
    >;

    const d401 = (type[401].name === "undefined"
        ? r.constantResponseDecoder<undefined, 401, "X-Request-Id">(401, undefined)
        : r.ioResponseDecoder<
            401,
            typeof type[401]["_A"],
            typeof type[401]["_O"],
            "X-Request-Id"
        >(401, type[401])) as r.ResponseDecoder<
        r.IResponseType<401, A2, "X-Request-Id">
    >;

    const d403 = (type[403].name === "undefined"
        ? r.constantResponseDecoder<undefined, 403, "X-Request-Id">(403, undefined)
        : r.ioResponseDecoder<
            403,
            typeof type[403]["_A"],
            typeof type[403]["_O"],
            "X-Request-Id"
        >(403, type[403])) as r.ResponseDecoder<
        r.IResponseType<403, A3, "X-Request-Id">
    >;

    const d429 = (type[429].name === "undefined"
        ? r.constantResponseDecoder<undefined, 429, "X-Request-Id">(429, undefined)
        : r.ioResponseDecoder<
            429,
            typeof type[429]["_A"],
            typeof type[429]["_O"],
            "X-Request-Id"
        >(429, type[429])) as r.ResponseDecoder<
        r.IResponseType<429, A4, "X-Request-Id">
    >;

    const d500 = (type[500].name === "undefined"
        ? r.constantResponseDecoder<undefined, 500, "X-Request-Id">(500, undefined)
        : r.ioResponseDecoder<
            500,
            typeof type[500]["_A"],
            typeof type[500]["_O"],
            "X-Request-Id"
        >(500, type[500])) as r.ResponseDecoder<
        r.IResponseType<500, A5, "X-Request-Id">
    >;

    return r.composeResponseDecoders(
        r.composeResponseDecoders(
            r.composeResponseDecoders(
                r.composeResponseDecoders(r.composeResponseDecoders(d200, d400), d401),
                d403
            ),
            d429
        ),
        d500
    );
}

// Decodes the success response with the type defined in the specs
export const updateInstitutionsDefaultDecoder = () =>
    updateInstitutionsDecoder();
