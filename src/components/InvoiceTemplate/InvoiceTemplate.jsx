import styles from './invoiceTemplate.module.scss'
import Image from 'next/image'
import invTemp1 from '../../assets/images/invTemp1.png'
import invTemp2 from '../../assets/images/invTemp2.png'
import invTemp3 from '../../assets/images/invTemp3.png'
import invTemp4 from '../../assets/images/invTemp4.png'
import { useState } from 'react'

import useTranslation from 'next-translate/useTranslation'

const InvoiceTemplate = ({ template, changeTemplate }) => {
  const { t } = useTranslation('common')

  const handleChange = (e) => {
    changeTemplate(e)
  }

  return (
    <div className={styles.section}>
      <h2>{t('choose_template')}</h2>

      <div className={styles.grid__wrapper}>
        {/* option 1 */}
        <div className={`${styles.template} ${template === 'template1' ? styles.selected : ''}`}>
          <label className={styles.label} htmlFor="template1">
            <input
              className={styles.radio}
              type="radio"
              name="test"
              value="template1"
              id="template1"
              checked={template === 'template1'}
              onChange={handleChange}
            />
            <div className={styles.imgContainer}>
              <Image
                className={styles.templateImg}
                src={invTemp1}
                alt={t('template_option_1')}
                priority
                unoptimized
              />
            </div>
            <p className={styles.templateName}>{t('template_option_1')}</p>
            <p className={styles.templateDesc}>{t('template_desc_1')}</p>
          </label>
        </div>

        {/* option 2 */}
        <div className={`${styles.template} ${template === 'template2' ? styles.selected : ''}`}>
          <label className={styles.label} htmlFor="template2">
            <input
              className={styles.radio}
              type="radio"
              name="test"
              value="template2"
              id="template2"
              checked={template === 'template2'}
              onChange={handleChange}
            />
            <div className={styles.imgContainer}>
              <Image
                className={styles.templateImg}
                src={invTemp2}
                alt={t('template_option_2')}
                priority
                unoptimized
              />
            </div>
            <p className={styles.templateName}>{t('template_option_2')}</p>
            <p className={styles.templateDesc}>{t('template_desc_2')}</p>
          </label>
        </div>

        {/* option 3 */}
        <div className={`${styles.template} ${template === 'template3' ? styles.selected : ''}`}>
          <label className={styles.label} htmlFor="template3">
            <input
              className={styles.radio}
              type="radio"
              name="test"
              value="template3"
              id="template3"
              checked={template === 'template3'}
              onChange={handleChange}
            />
            <div className={styles.imgContainer}>
              <Image
                className={styles.templateImg}
                src={invTemp3}
                alt={t('template_option_3')}
                priority
                unoptimized
              />
            </div>
            <p className={styles.templateName}>{t('template_option_3')}</p>
            <p className={styles.templateDesc}>{t('template_desc_3')}</p>
          </label>
        </div>
        {/* option 4 */}
        <div className={`${styles.template} ${template === 'template4' ? styles.selected : ''}`}>
          <label className={styles.label} htmlFor="template4">
            <input
              className={styles.radio}
              type="radio"
              name="test"
              value="template4"
              id="template4"
              checked={template === 'template4'}
              onChange={handleChange}
            />
            <div className={styles.imgContainer}>
              <Image
                className={styles.templateImg}
                src={invTemp4}
                alt={t('template_option_4')}
                priority
                unoptimized
              />
            </div>
            <p className={styles.templateName}>{t('template_option_4')}</p>
            <p className={styles.templateDesc}>{t('template_desc_4')}</p>
          </label>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTemplate
