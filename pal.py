import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
from perlin_numpy import generate_fractal_noise_3d

np.random.seed(100)
noise = generate_fractal_noise_3d(
    (32, 256, 256), (1, 4, 4), 4, tileable=(True, True, True)
)

aspect_ratio = noise.shape[2] / noise.shape[1]

fig = plt.figure(figsize=(8, 8 * aspect_ratio))
fig.subplots_adjust(left=0, bottom=0, right=1, top=1, wspace=None, hspace=None)

# Hide the axes
plt.axis('off')

# Create images
images = [[plt.imshow(layer, cmap='inferno', interpolation='lanczos', animated=True)] for layer in noise]

# Create the animation
animation_3d = animation.ArtistAnimation(fig, images, interval=50, blit=True)

# Save the animation as a GIF
animation_3d.save('media/main/perlin.gif', writer='Pillow')

# Display the animation
