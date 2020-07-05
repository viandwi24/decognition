export const index = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Decognition Exception Handler - <%= message %></title>
    <style>
        .h-half { height: 50%; }
        .stack-frames-scroll {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .stack-frame-group {
            border-bottom-width: 1px;
            border-color: rgb(232, 229, 239);
            background-color: rgb(255, 255, 255);
        }
        @media (min-width: 640px) {
            .stack-frame {
                grid-template-columns: 3rem 1fr auto;
            }
        }
        .stack-frame {
            display: grid;
            align-items: flex-end;
            grid-template-columns: 2rem auto auto;
        }
        .stack-frame-number {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
            color: rgb(121, 0, 245);
            font-feature-settings: "tnum";
            font-variant-numeric: tabular-nums;
            text-align: center;
        }
        .stack-frame-text {
            display: grid;
            align-items: center;
            grid-gap: 0.5rem;
            border-left-width: 2px;
            padding-left: 0.75rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
            border-color: rgb(214, 188, 250);
            color: rgb(75, 71, 109);
        }
        .stack-frame-header {
            margin-right: -2.5rem;
            width: 100%;
        }
        .stack-frame-line {
            padding-left: 0.5rem;
            padding-right: 0.25rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
            text-align: right;
            line-height: 1.25;
        }
        .stack-main {
            display: grid;
            height: 100%;
            overflow: hidden;
            background-color: rgb(247, 247, 252);
            background-color: var(--gray-100);
            grid-template: auto 1fr / 100%;
        }
    </style>
    <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/themes/prism.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/plugins/line-highlight/prism-line-highlight.min.css" rel="stylesheet">
    <style>
        pre {
            overflow: auto;
            word-wrap: normal;
            white-space: pre;
        }
        .preview-grid {
            display: grid;
            grid-template-rows: auto 100%;
            width: 100%;
        }
        .preview-content {
            min-height: 0;
            overflow-y: scroll;
        }
        .preview-stack { display: none; }
        .preview-stack.active { display: block; }
    </style>
</head>
<body class="bg-gray-300">
    <div class="container mx-auto lg:px-12 px-4">
        <div class="mt-12">
            <div class="card bg-white border-2 border-gray-400">
                <div class="card-header p-2 px-8 border-b-2 border-gray-400">
                    <span class="text-gray-600 text-xs"><%= base_path %></span>
                </div>
                <div class="card-body px-16 py-12">
                    <div class="text-2xl text-gray-500" style="word-wrap: break-word;"><%= name %></div>
                    <div class="text-3xl font-semibold">
                        <%= message %>
                    </div>
                    
                    <div class="mt-6">
                        <a href="<%= url %>" class="text-sm text-gray-700 underline"><%= url %></a>
                    </div>
                    
                </div>
            </div>

            <div class="mt-10">
                <div class="tab flex flex-col bg-white border-2 border-gray-400" style="height: 100vh;max-height: 100vh;">
                    <div class="w-full tab-header">
                        <div class="w-full bg-indigo-500 flex flex-grow items-center px-8 py-2 justify-center">
                            <div class="menu">
                                <div class="menu-center flex flex-grow">
                                    <a href="#" class="flex py-2 px-4 mx-1 text-gray-300 hover:bg-indigo-600 bg-indigo-700 hover:bg-indigo-700">
                                        Stack Trace
                                    </a>
                                    <a href="#" class="flex py-2 px-4 mx-1 text-gray-300 hover:bg-indigo-600">
                                        Dump
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-body bg-white h-full">
                        <div class="tab-item h-full">
                            <div class="flex w-full lg:flex-row flex-col h-full">
                                <div class="stack-nav flex lg:w-4/12 w-full lg:h-full h-half relative">
                                    <ol class="stack-frames-scroll scrollbar text-xs">
                                        <% for(let i in stack) { %>
                                            <li>
                                                <ul class="stack-frame-group">
                                                    <li class="stack-frame cursor-pointer <%= (parseInt(i) == 0) ? "bg-indigo-200" : "" %>" data-stack="<%= stack.length - (parseInt(i)) %>">
                                                        <div class="stack-frame-number"><%= stack.length - (parseInt(i)) %></div>
                                                        <div class="stack-frame-text">
                                                            <header class="stack-frame-header mb-1">
                                                                <span class="inline-flex justify-start items-baseline stack-frame-path">
                                                                    <span class="ui-path text-purple-800">
                                                                        <div style="word-wrap: break-word;"><%= stack[i].fileName %></div>
                                                                    </span>
                                                                </span>
                                                            </header>
                                                            <span class="stack-frame-exception-class">
                                                                <span class="ui-exception-class stack-frame-exception-class">
                                                                    <span class="opacity-75"><%= stack[i].functionName %></span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div class="stack-frame-line">
                                                            <span class="ui-line-number">
                                                                <%= stack[i].lineNumber %> :
                                                                <span class="font-mono"><%= stack[i].columnNumber %></span>
                                                            </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </li>
                                        <% } %>                                        
                                    </ol>
                                </div>
                                <div class="stack-main lg:w-8/12 bg-gray-100 lg:h-full h-half">
                                    <% for(let i in stack) {  %> 
                                        <div id="preview-stack-<%= stack.length - (parseInt(i)) %>" style="position: relative;" class="preview-stack <%= (i == 0) ? "active" : "" %>">
                                            <div class="preview-grid bg-indigo-100 w-full h-full" style="flex-direction: column;">
                                                <div class="preview-column w-full p-4">
                                                    <div class="text-sm text-gray-700 opacity-75"><%= stack[i].functionName %></div>
                                                    <div class="text-sm text-indigo-700">
                                                        <%= stack[i].fileName %>
                                                        :<span class="font-mono"><%= stack[i].lineNumber %></span>
                                                    </div>
                                                </div>
                                                <div class="preview-content" style="overflow: auto;">
                                                    <pre 
                                                    data-start="<%= stack[i].preview.startLine %>"
                                                    data-line="<%= stack[i].lineNumber %>"
                                                    class="line-numbers" 
                                                    style="margin: 0;"><code class="language-javascript"><%= stack[i].preview.file %></code></pre>
                                                </div>
                                            </div>
                                        </div>
                                    <% } %> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/plugins/line-highlight/prism-line-highlight.min.js"></script>
    <script>
        document.querySelectorAll(".stack-frame").forEach((val) => {
            val.addEventListener("click", function (e) {
                let select_stack = this.dataset.stack;
                let preview_old = document.querySelectorAll(".preview-stack");
                let preview = document.getElementById("preview-stack-" + select_stack);
                let frame_old = document.querySelectorAll(".stack-frame");
                let frame = this;

                preview_old.forEach((val) => { val.classList.remove("active"); });
                preview.classList.add("active");

                frame_old.forEach((val) => { val.classList.remove("bg-indigo-200") });
                frame.classList.add("bg-indigo-200");
                
                Prism.highlightAll();
            });
        });
    </script>
</body>
</html>`;