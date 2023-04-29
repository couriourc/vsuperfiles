/** -*- coding: utf-8 -*-
 * Copyright (C) 2021  * @Time    : 2023/4/29 0029 18:31
 * @Author  : CouriourC
 * @Email   : godakid@outlook.com
 * @File    : index
 * @Software: WebStorm
 */

export function vFiles(options) {
    return {
        directives: {
            [options.name ?? 'files']: {
                bind(el, binding, vm) {
                    const {modifiers} = binding;
                    // 获取文件约束限制
                    const {accept: constraint, multiple, files, paths, customize} = binding?.value ?? {};

                    function sync(_files, _paths) {
                        files?.push?.(..._files);
                        paths?.push?.(..._paths);
                        vm.data.on?.['files-change']?.(_files, _paths);
                    }

                    // 创建文件入口
                    const input = document.createElement('input');
                    // ============= S 创建文件按钮，绑定文件操作 ===============
                    {
                        // 绑定文件事件
                        input.setAttribute('type', 'file');
                        // 限制类型
                        ((el, constraint) => {
                            if (!constraint || !constraint.length) return;
                            el.setAttribute('accept', `${constraint.join(',')}`);
                        })(input, constraint);
                        // 更多自定义 input 的事件
                        ((el, attributesBuilder) => {
                            if (!attributesBuilder) return;
                            attributesBuilder(input);
                            // el.setAttribute('accept', `${constraint.join(',')}`);
                        })(input, customize);

                        // 多选模式
                        ((el, multiple) => {
                            if (!multiple || !constraint.length) return;
                            el.setAttribute('multiple', multiple);
                        })(el, multiple);
                        // 文件夹模式
                        ((el) => {
                            if (!modifiers.webkitdirectory) return;
                            el.setAttribute('webkitdirectory', 'webkitdirectory');
                        })(input);
                        // 绑定文件改变
                        input.addEventListener('change', ({target}) => {
                            const files = target.files;
                            const paths = [];
                            for (let idx = 0; idx < files.length; idx++) {
                                paths.push(files[idx].webkitRelativePath);
                            }
                            sync(files, paths);
                        });
                    }
                    // ============= E 创建文件按钮，绑定文件操作 ===============
                    // ============= S 转发事件 ===============
                    {
                        //  转发事件
                        el.addEventListener('click', () => {
                            input.click();
                        });
                        // 接收拖拽
                        ((el) => {
                            if (!modifiers.drag) return;
                            el.addEventListener('dragover', _ => _.preventDefault());

                            function parserDataTransferItems(entry, cb) {
                                if (entry.isFile) {
                                    entry.file(file => {
                                        let path = entry.fullPath.substring(1);
                                        cb(file, path);
                                    });
                                } else {
                                    const reader = entry.createReader();
                                    reader.readEntries(entries => {
                                        entries.forEach(entry => {
                                            parserDataTransferItems(entry, cb);
                                        });
                                    }, e => {
                                        vm.data.on?.['drag-error']?.(e);
                                        throw Error(e);
                                    });
                                }
                            }

                            el.addEventListener('drop', (ev) => {
                                ev.preventDefault();
                                const dt = ev.dataTransfer;
                                for (let each of dt.items) {
                                    const entry = each.webkitGetAsEntry();
                                    parserDataTransferItems(entry, (file, path) => {
                                        sync([file], [path]);
                                    });
                                }
                            }, false);
                        })(el);
                    }
                    // ============= E 转发事件 ===============
                },
            },
        },
    };
};
export default function install(options) {
    return (app) => app.mixin(vFiles(options));
}
