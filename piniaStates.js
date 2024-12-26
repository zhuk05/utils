import {defineStore} from 'pinia';

//common usage
export const useArticleStore = defineStore('articleStore', {
	state: () => ({
		articleData: null
	}),
	
	actions: {
		setArticleData(article) {
			this.articleData = article;
		}
	},
	
	getters: {
		getData: (state) => state.articleData,
		getArticleId: (state) => state.articleData?.id
	}
});

//contextual?? dif common usage
export const useCodeStore = defineStore('codeStore', {
  state: () => {
      return {
          editor: null,
          id: "demo",
          modelService: null,
          rtModel: null,
          domain: null,
          modelId: ''
      };
  },
  actions: {
      insert(text) {
          this.editor.insert(text);
      },
      async setEditor(editor, fileID, domainModel) {
          this.editor = editor;
          this.id = fileID;
          this.modelService = domainModel;
          this.editor.setReadOnly(true);
          await this.autoCreateModel(this.id);
      },
      async createModel (modelId, content){
          this.rtModel = await this.modelService.create( {
              collection: "example",
              id: modelId,
              data: {
                  content: content ? content : ''
              }
          })
      },
      async autoCreateModel(modelId, content) {
          try {
              this.rtModel = await this.modelService.openAutoCreate({
                  collection: "example",
                  id: modelId,
                  data: {
                      content: content ? content : ''
                  }
              });
              const contentModel = this.rtModel.root().elementAt("content");
              this.editor.getSession().setValue(contentModel.value());
              const binder = new AceBinder(this.editor, contentModel, true);
              binder.bind();
              this.editor.setReadOnly(false);
          } catch (err) {
              console.error("Ошибка в autoCreateModel:", err);
          }
      },
      async saveOpenModel(modelId) {
          try {
              const results = await this.modelService.query(`SELECT * FROM example WHERE @id like "${modelId}%"`);
              if (results.data && results.data.length > 0) {
                  return results.data;
              }
              return null;
          } catch (err) {
              console.error("Ошибка в autoCreateModel:", err);
              return null;
          }
      },
      async deleteModel(modelId) {
          return this.modelService.remove(modelId);
      }
  },
  getters: {
      getInstance: (state) => () => state.editor,
      getDoc: (state) => {
          return () => {
              return state.editor.getValue();
          };
      },
      getSelectionPos: (state) => {
          /**
           * @returns { start: {row: number, column: number}, end: {row: number, column: number} }
           */
          return () => {
              return state.editor.session.selection.getRange();
          };
      },
      getSelection(state) {
          return () => {
              return state.editor.getSelectedText();
          };
      },
      w: (state) => state.rtModel
  }
});
