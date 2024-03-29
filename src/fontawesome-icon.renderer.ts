import { STYLESHEET_ATTRIBUTE_NAME } from '@enhanced-dom/css'
import { type IAbstractElement } from '@enhanced-dom/dom'
import { icon, type IconDefinition, library as faLib, config as faConfig, dom as faDom } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'
import uniqueId from 'lodash.uniqueid'

faConfig.autoAddCss = false

const concatenateStyles = (...styles: string[]) => {
  const meaningfulStyles = styles.filter((s) => !!s)
  if (!meaningfulStyles.length) {
    return undefined
  }
  return meaningfulStyles.join(';')
}

export class FontawesomeIconRenderer {
  static registeredIcons = []
  private _titleId = uniqueId('fontawesome-icon-')
  public getIcon = <T extends IconDefinition>({
    config,
    title,
    style = '',
    ...rest
  }: {
    config: T
    title?: string
    style?: string
    class?: string
  }): IAbstractElement[] => {
    faLib.add(config)
    const renderedIcon = icon(config)

    if (!renderedIcon) {
      return null
    }

    const { abstract } = renderedIcon

    const abstractElement = {
      ...abstract[0],
      attributes: {
        ...abstract[0].attributes,
        ...rest,
        style: concatenateStyles(style, abstract[0].attributes.style),
        class: classNames(abstract[0].attributes.class, rest.class),
      },
    } as IAbstractElement

    if (title) {
      abstractElement.attributes['aria-labelledby'] = this._titleId
      const titleElement = { tag: 'title', attributes: { id: this._titleId }, children: [{ content: title }] }
      abstractElement.children.unshift(titleElement)
    }

    return [
      { tag: 'style', attributes: { [STYLESHEET_ATTRIBUTE_NAME]: 'enhanced-dom-fontawesome' }, children: [{ content: faDom.css() }] },
      abstractElement,
    ]
  }
}
