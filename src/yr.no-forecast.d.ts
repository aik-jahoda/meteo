declare module 'xml-to-json-stream' {

    export interface Parser {
        // createStream : createStream,
        xmlToJson: <T> (xml: string, callback: (error: Error, json: any) => T) => T;
    }

    export default function xmlToJson(options?: { attributeMode: boolean }): Parser
}