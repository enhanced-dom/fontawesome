import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { icon, library as faLib } from '@fortawesome/fontawesome-svg-core'
import { IAbstractElement } from '@enhanced-dom/webcomponent'
import classNames from 'classnames'
import uniqueId from 'lodash.uniqueid'
import { IIconInterpreter } from '@enhanced-dom/icon'
import '@fortawesome/fontawesome-svg-core/styles.css'

const concatenateStyles = (...styles: string[]) => {
  const meaningfulStyles = styles.filter((s) => !!s)
  if (!meaningfulStyles.length) {
    return undefined
  }
  return meaningfulStyles.join(';')
}

export class FontawesomeIconRenderer implements IIconInterpreter<IconDefinition, any> {
  static registeredIcons = []
  private _titleId = uniqueId('fontawesome-icon-')
  public getIcon = ({ config, title, style = '', ...rest }) => {
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
      const titleElement = { tag: 'title', attributes: { id: this._titleId }, children: [title] }
      abstractElement.children.unshift(titleElement)
    }

    return abstractElement
  }
}
