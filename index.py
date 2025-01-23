import jieba #引入结巴库
from wordcloud import WordCloud #引入词云图
import matplotlib.pyplot as plt
import sys
text = sys.argv[1]
words = jieba.cut(text) #中文分词
#添加字体文件 随便找一个字体文件就行 不然不支持中文
font = './MechSong-DemiBold-2.ttf'
info = WordCloud(font_path=font,width=1000,height=800,background_color='white').generate(''.join(words))

#输出词云图
plt.imshow(info,interpolation='bilinear')
plt.axis('off')
plt.show()

