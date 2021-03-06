import { httpObject, ProblemInterface } from "types";

enum COPY_MODE {
    SKIP_PROPS = 'skipProps',
    LEAVE_PROPS = 'leaveProps'
}

export class Problem extends Error implements ProblemInterface {
    public type: string;
    public title: string;
    public instance?: string;
    public detail?: string;
    public http?: httpObject
    [key: string]: any;


    constructor(problem: ProblemInterface, customKeys?: string[]) {
        super(problem.detail || problem.title);
        this.http = problem.http
        this.type = problem.type
        this.title = problem.title;
        this.detail = problem.detail;
        this.instance = problem.instance;
        this.stack = problem.stack;
        customKeys?.map((customKey) => {
            this[customKey] = problem[customKey];
        })
    }

   copy(problem: ProblemInterface, mode: COPY_MODE, props: string[]): Problem {
        switch (mode) {

            case COPY_MODE.LEAVE_PROPS:
                return new Problem(problem, props);

            case COPY_MODE.SKIP_PROPS:
            default:
                let keysToBeCopied: string[] = [];
                for (let key in problem) {
                    if (props.includes(key))
                        continue;
                    keysToBeCopied.push(key)
                }
                return new Problem(problem, keysToBeCopied)
        }
    };

   toJSON(problem: Problem, includeStack = false): ProblemInterface {

        const { name, message, stack, ...rest } = problem;

        const jsonObject = {
            ...rest
        }

        if (includeStack)
            jsonObject.stack = stack;

        return jsonObject;

    }
};