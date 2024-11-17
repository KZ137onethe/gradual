import {addIcon} from '@iconify/vue';

export async function addReignIcon(iconName: string){
    try {
        console.log('addReignIcon', iconName)
        // 动态加载指定的 SVG 文件
        const iconModule = await import(`@/assets/icon/${iconName}.svg?raw`);
        // 添加自定义图标
        addIcon(`custom:${iconName}`, {
            body: iconModule.default,  // 将 SVG 内容作为 body
        });
    } catch (error) {
        console.error(`Error loading icon "${iconName}":`, error);
    }
}
