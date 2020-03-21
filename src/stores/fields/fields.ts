import { createStore } from 'pinia';
import { FieldRaw, Field } from './types';
import api from '@/api';
import { useProjectsStore } from '@/stores/projects';
import VueI18n from 'vue-i18n';
import { notEmpty } from '@/utils/is-empty/';
import { i18n } from '@/lang';
import formatTitle from '@directus/format-title';

export const useFieldsStore = createStore({
	id: 'fieldsStore',
	state: () => ({
		fields: [] as Field[]
	}),
	actions: {
		async hydrate() {
			const projectsStore = useProjectsStore();
			const currentProjectKey = projectsStore.state.currentProjectKey;

			const response = await api.get(`/${currentProjectKey}/fields`);

			const fields: FieldRaw[] = response.data.data;

			this.state.fields = fields.map(field => {
				let name: string | VueI18n.TranslateResult;

				if (notEmpty(field.translation)) {
					for (let i = 0; i < field.translation.length; i++) {
						const { locale, translation } = field.translation[i];

						i18n.mergeLocaleMessage(locale, {
							fields: {
								[field.field]: translation
							}
						});
					}

					name = i18n.t(`fields.${field.field}`);
				} else {
					name = formatTitle(field.field);
				}

				return {
					...field,
					name
				};
			});
		},
		async dehydrate() {
			this.reset();
		},
		getPrimaryKeyFieldForCollection(collection: string) {
			/** @NOTE it's safe to assume every collection has a primary key */
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const primaryKeyField = this.state.fields.find(
				field => field.collection === collection && field.primary_key === true
			);

			return primaryKeyField;
		}
	}
});
