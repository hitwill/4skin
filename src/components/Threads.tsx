import * as React from 'react';
import { Thread } from './Thread';
import { ThreadProps } from './Thread';
import Reply from './Reply';

interface ThreadsProps {
    pageNumber: number;
    threads: Array<ThreadProps>;
    isReply: boolean;
}

interface ThreadsState {
    isSingleThread: ThreadProps | boolean;
}

class Threads extends React.Component<ThreadsProps, ThreadsState> {
    constructor(props: Readonly<ThreadsProps>) {
        super(props);
        this.state = {
            isSingleThread: false
        };
        this.singleThreadActive = this.singleThreadActive.bind(this);
        this.multipleThreadsActive = this.multipleThreadsActive.bind(this);
    }

    allThreads() {
        return this.props.threads.map((threadData: ThreadProps) => {
            return this.props.isReply ? (
                <Reply
                    {...threadData}
                    isSingleThread={true}
                    key={threadData.number}
                />
            ) : (
                <Thread
                    {...threadData}
                    key={threadData.number}
                    setSingleThread={this.singleThreadActive}
                    setMultipleThreads={this.multipleThreadsActive}
                    isSingleThread={this.props.isReply}
                />
            );
        });
    }

    singleThreadActive(threadProps: ThreadProps) {
        this.setState(() => ({
            ...this.state,
            isSingleThread: threadProps as ThreadProps
        }));
    }

    componentDidMount() {
        this.listenHistory();
    }

    showRepliesLoading(replies: any) {
        for (let i = 0; i < replies.length; i++) {
            replies[i].style.opacity = '0.2';
        }
    }

    listenHistory() {
        if (this.props.isReply) return;
        window.addEventListener(
            'popstate',
            function(e: { state: ThreadsState }) {
                let location = document.location;
                let state: ThreadsState = e.state;
                let replies = document.getElementsByClassName('reply');
                this.showRepliesLoading(replies);
                setTimeout(
                    function() {
                        this.multipleThreadsActive();
                    }.bind(this),
                    1000
                );
            }.bind(this)
        );
    }

    multipleThreadsActive() {
        this.setState(() => ({
            ...this.state,
            isSingleThread: false as boolean
        }));
    }

    singleThread(threadProps: ThreadProps | Boolean) {
        let props = threadProps as ThreadProps;
        return (
            <Thread
                {...props}
                key={props.number}
                isSingleThread={true}
                setSingleThread={this.singleThreadActive}
                setMultipleThreads={this.multipleThreadsActive}
            />
        );
    }

    render() {
        if (this.state.isSingleThread === false) {
            return this.allThreads();
        } else {
            return this.singleThread(this.state.isSingleThread);
        }
    }
}

export { Threads, ThreadsProps };
