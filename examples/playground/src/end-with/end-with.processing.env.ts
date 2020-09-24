import { PROCESSING } from '../code-editor/code-editor.feature';
import EndWith from './end-with.feature';

EndWith.setup(PROCESSING, ({}, { preview }) => {
    preview.complierExtension.register({
        compile(content: string) {
            return content + '!!!!!!!';
        },
        matcher(_content: string) {
            return _content.includes('!');
        },
    });
});
